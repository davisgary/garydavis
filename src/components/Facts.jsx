import { useEffect, useState } from "react";
import { getMessage } from "../api/facts";

function Facts() {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageIndex, setMessageIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [facts, setFacts] = useState([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(document.visibilityState === "visible");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    setIsVisible(document.visibilityState === "visible");

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const fetchFacts = async () => {
      const fetchedFacts = await getMessage();
      setFacts(fetchedFacts);
    };

    fetchFacts();
  }, []);

  useEffect(() => {
    let typingTimeout;

    if (!isVisible) return;

    if (facts.length > 0) {
      const currentFact = facts[messageIndex];

      if (charIndex < currentFact.length) {
        typingTimeout = setTimeout(() => {
          setCurrentMessage((prev) => prev + currentFact[charIndex]);
          setCharIndex((prev) => prev + 1);
        }, 30);
      } else {
        typingTimeout = setTimeout(async () => {
          if (messageIndex + 1 < facts.length) {
            setMessageIndex((prev) => prev + 1);
          } else {
            const newFacts = await getMessage();
            setFacts(newFacts);
            setMessageIndex(0);
          }

          setCharIndex(0);
          setCurrentMessage("");
        }, 5000);
      }
    }

    return () => clearTimeout(typingTimeout);
  }, [charIndex, messageIndex, facts, isVisible]);

  return <div>{currentMessage}</div>;
}

export default Facts;