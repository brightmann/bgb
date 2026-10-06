import React from "react";
import styles from "./reactions-bar.module.css";

function ReactionsBar({ reactionsData }) {
  const [reactions, setReactions] = React.useState({});

  const prepareReactions = () => {
    let reactions = {
      THUMBS_DOWN: { content: "👎", count: 0, names: [] },
      THUMBS_UP: { content: "👍", count: 0, names: [] },
      HEART: { content: "❤️", count: 0, names: [] },
      HOORAY: { content: "🎉", count: 0, names: [] },
      LAUGH: { content: "🤣", count: 0, names: [] },
      ROCKET: { content: "🚀", count: 0, names: [] },
      CONFUSED: { content: "😕", count: 0, names: [] },
      EYES: { content: "👀", count: 0, names: [] },
      TOTAL_COUNT: reactionsData.totalCount
    };
    if (reactions.TOTAL_COUNT) {
      reactionsData.nodes.forEach(reaction => {
        reactions[reaction.content].count += 1;
        reactions[reaction.content].names.push(reaction.user.login);
      });
    }

    return reactions;
  };

  React.useEffect(() => {
    setReactions(prepareReactions());
  }, []);

  if (reactions.TOTAL_COUNT) {
    return (
      <ul className={styles.reactionsList}>
        {Object.keys(reactions)
          .filter(reactionKey => reactions[reactionKey].count > 0)
          .map((reactionKey, index) => (
            <li
              style={{ cursor: "pointer" }}
              key={index}
              className={styles.reactionsListItem}
              uk-tooltip={`title: ${reactions[reactionKey].names.join(
                ", "
              )}; delay: 500`}
            >
              {reactions[reactionKey].content} {reactions[reactionKey].count}
            </li>
          ))}
      </ul>
    );
  } else {
    return null;
  }
}

export default ReactionsBar;
