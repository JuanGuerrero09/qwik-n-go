import { component$, useSignal, useStylesScoped$, useTask$ } from "@builder.io/qwik";
import { routeLoader$, routeAction$, Form, server$ } from "@builder.io/qwik-city";
import STYLES from "./index.css?inline"

export default component$(() => {
  const dadJokeSignal = useDadJoke();
  const favoriteJokeAction = useJokeVoteAction();
  const isFavoriteSignal = useSignal(false)
  useStylesScoped$(STYLES)
  useTask$(({ track }) => {
    track(isFavoriteSignal);
    console.log("FAVORITE (isomorphic)", isFavoriteSignal.value);
    server$(() => {
      console.log("FAVORITE (server)", isFavoriteSignal.value);
    })()
  })
  return (
    <div class="section bright">
      <div>{dadJokeSignal.value.joke}</div>
      <Form action={favoriteJokeAction}>
        <input type="hidden" name="jokeID" value={dadJokeSignal.value.id} />
        <button name="vote" value="up">
          👍
        </button>
        <button name="vote" value="down">
          👎
        </button>
      </Form>
      <button onClick$={() => isFavoriteSignal.value = !isFavoriteSignal.value}>
  {isFavoriteSignal.value ? "❤️" : "🤍"}
</button>
    </div>
  );
});

export const useDadJoke = routeLoader$(async () => {
  const response = await fetch("https://icanhazdadjoke.com/", {
    headers: { Accept: "application/json" },
  });
  return (await response.json()) as {
    id: string;
    status: number;
    joke: string;
  };
});

export const useJokeVoteAction = routeAction$((props) => {
  // Leave it as an exercise for the reader to implement this.
  console.log("VOTE", props);
});
