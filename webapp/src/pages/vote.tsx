import { useLocation } from "preact-iso";
import { FC } from "preact/compat";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Artwork, Event, Vote, pocketbase } from "../services/pocketbase";
import { LoadingOverlay } from "../components/loading-overlay";
import { useState, useEffect, useRef } from "preact/hooks";

type Props = {
  event: string;
  artwork: string;
};

export const VotePage: FC<Props> = (props) => {
  const { route } = useLocation();
  const { event: eventId, artwork: artId } = props;
  const [voted, setVoted] = useState<string | null>(null);
  const [voteId, setVoteId] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  // Create refs for DOM elements
  const feedbackModalRef = useRef<HTMLDialogElement>(null);

  const { error, data, isLoading } = useQuery({
    queryKey: [eventId, artId],
    queryFn: async () => {
      const [event, artwork] = await Promise.all([
        pocketbase.collection("events").getOne<Event>(eventId),
        pocketbase.collection("artworks").getOne<Artwork>(artId),
      ]);

      if (!event || !artwork) {
        throw new Error("Event or artwork not found");
      }
      return { event, artwork };
    },
  });

  // Mutation for creating a vote
  const createVoteMutation = useMutation({
    mutationFn: async (voteData: Partial<Vote>) => {
      return await pocketbase.collection("votes").create(voteData);
    },
    onSuccess: (data) => {
      // Store the vote ID for potential updates
      setVoteId(data.id);
      // Store in localStorage to prevent re-voting
      const voteKey = `vote_${eventId}_${artId}`;
      localStorage.setItem(voteKey, voted as string);
      // Open modal for additional feedback
      feedbackModalRef.current?.showModal();
    },
    onError: (error) => {
      console.error("Failed to save vote:", error);
      alert("There was an error saving your vote. Please try again.");
    },
  });

  // Mutation for updating a vote
  const updateVoteMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Vote> }) => {
      return await pocketbase.collection("votes").update(id, data);
    },
    onSuccess: () => {
      feedbackModalRef.current?.close();
    },
    onError: (error) => {
      console.error("Failed to update vote:", error);
      alert(
        "There was an error updating your feedback. Your vote was still recorded.",
      );
      feedbackModalRef.current?.close();
    },
  });

  // Check localStorage to see if user has already voted
  useEffect(() => {
    const voteKey = `vote_${eventId}_${artId}`;
    const storedVote = localStorage.getItem(voteKey);
    if (storedVote) {
      setVoted(storedVote);
    }
  }, [eventId, artId]);

  if (error) {
    route("/not-found", true);
    return <></>;
  }

  if (isLoading) {
    return <LoadingOverlay />;
  }

  const media =
    data?.artwork.media.map((m) => {
      return pocketbase.files.getURL(data.artwork, m);
    }) ?? [];

  const handleVote = (vote: string) => {
    // Save vote in state
    setVoted(vote);

    // Create vote record in PocketBase
    createVoteMutation.mutate({
      artwork: artId,
      event: eventId,
      yeahnah: vote === "yeah",
    });
  };

  const submitFeedback = () => {
    // Only update if we have a voteId (which should be the case)
    if (voteId) {
      const updateData: Partial<Vote> = {};

      if (email) updateData.email = email;
      if (comment) updateData.message = comment;
      if (name) updateData.name = name;

      updateVoteMutation.mutate({
        id: voteId,
        data: updateData,
      });
    } else {
      console.error("No vote ID available for update");
      feedbackModalRef.current?.close();
    }
  };

  return (
    <div class="flex flex-col items-center min-h-screen bg-base-200 pb-10">
      {/* Main content */}
      <div class="container max-w-md mx-auto px-4 pt-4">
        <div class="max-w-md w-full text-center my-5">
          <h1 class="text-5xl">
            <span class="font-fancy">Yeah!</span>Nah!
          </h1>
        </div>

        {/* Artwork title and author */}
        <div class="text-center mb-4">
          <h2 class="text-xl font-normal text-base-content">
            {data?.artwork.name || "Untitled"}
          </h2>
          <p class="text-sm text-base-content">
            By {data?.artwork.author || "Anonymous Artist"}
          </p>
        </div>

        {/* Image carousel */}
        {media.length > 0 ? (
          <div class="carousel w-full rounded-lg overflow-hidden bg-base-300 aspect-square mb-4">
            {media.map((url, index) => (
              <div
                id={`slide${index + 1}`}
                class="carousel-item relative w-full"
              >
                <img
                  src={url}
                  alt={`Artwork ${index + 1}`}
                  class="w-full h-full object-cover"
                />
                <div class="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                  <a
                    href={`#slide${index === 0 ? media.length : index}`}
                    class="btn btn-circle bg-base-100 bg-opacity-50"
                  >
                    ❮
                  </a>
                  <a
                    href={`#slide${index === media.length - 1 ? 1 : index + 2}`}
                    class="btn btn-circle bg-base-100 bg-opacity-50"
                  >
                    ❯
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div> </div>
        )}

        {/* Artwork description */}
        {data?.artwork.description && (
          <div class="mb-6 px-2 text-center">
            <p class="text-base-content">{data.artwork.description}</p>
          </div>
        )}

        {/* Artist link */}
        {data?.artwork.link && (
          <div class="text-center mb-6">
            <a
              href={data.artwork.link}
              target="_blank"
              rel="noopener noreferrer"
              class="text-base-content underline"
            >
              View more from this artist
            </a>
          </div>
        )}

        {/* Stylized voting options side by side with "or" between */}
        {!voted ? (
          <div class="mt-8">
            <div class="flex justify-center items-center gap-4">
              <div
                onClick={() =>
                  !createVoteMutation.isPending && handleVote("yeah")
                }
                class={`font-fancy text-5xl text-success hover:scale-110 transition-transform cursor-pointer ${createVoteMutation.isPending ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                Yeah!
              </div>
              <div class="text-xl text-base-content">or</div>
              <div
                onClick={() =>
                  !createVoteMutation.isPending && handleVote("nah")
                }
                class={`text-5xl text-error hover:scale-110 transition-transform cursor-pointer ${createVoteMutation.isPending ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                Nah!
              </div>
            </div>
            <div class="text-center mt-4 text-base-content text-sm opacity-80">
              Cast your vote
            </div>
          </div>
        ) : (
          <div class="mt-8 text-center">
            <p class="text-base-content text-xl">Thanks for voting!</p>
          </div>
        )}

        {/* Loading indicator while vote is being saved */}
        {createVoteMutation.isPending && (
          <div class="mt-6 flex justify-center">
            <span class="loading loading-spinner loading-lg"></span>
          </div>
        )}
      </div>

      {/* Feedback Modal with ref */}
      <dialog ref={feedbackModalRef} class="modal">
        <div class="modal-box bg-primary">
          <h3 class="text-lg font-bold text-primary-content">
            Thanks for your vote!
          </h3>
          <p class="py-2 text-primary">
            Would you like to share more feedback about this artwork?
          </p>

          <div class="form-control w-full mt-2">
            <label class="label">
              <span class="label-text text-primary-content">
                Your name (optional)
              </span>
            </label>
            <input
              type="text"
              placeholder="Your name"
              class="input input-bordered w-full"
              value={name}
              onInput={(e) => setName((e.target as HTMLInputElement).value)}
            />
          </div>

          <div class="form-control w-full mt-2">
            <label class="label">
              <span class="label-text text-primary-content">
                Your thoughts (optional)
              </span>
            </label>
            <textarea
              class="textarea textarea-bordered h-24"
              placeholder="What did you like or dislike about this piece?"
              value={comment}
              onInput={(e) =>
                setComment((e.target as HTMLTextAreaElement).value)
              }
            ></textarea>
          </div>

          <div class="form-control w-full mt-2">
            <label class="label">
              <span class="label-text text-primary-content">
                Email (optional)
              </span>
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              class="input input-bordered w-full"
              value={email}
              onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
            />
            <label class="label">
              <span class="label-text-alt text-primary-content text-sm">
                We'll only use this to contact you about future events
              </span>
            </label>
          </div>

          <div class="modal-action">
            <form method="dialog" class="flex gap-2">
              <button class="btn btn-accent btn-outline">Skip</button>
              <button
                class="btn btn-accent"
                onClick={submitFeedback}
                type="button"
                disabled={updateVoteMutation.isPending}
              >
                {updateVoteMutation.isPending ? (
                  <span class="loading loading-spinner loading-xs"></span>
                ) : (
                  "Submit Feedback"
                )}
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};
