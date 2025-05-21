import '../app.css';
import { useEffect, useState } from "react";
import { getMessage } from "../api/facts";

function Messages() {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageIndex, setMessageIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [facts, setFacts] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const [shownFacts, setShownFacts] = useState(() => {
    const stored = localStorage.getItem("shownFacts");
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });
  const [phase, setPhase] = useState("intro1");

  const introMessages = {
    intro1: "Hi there, welcome!",
    intro2: "Thanks for stopping by.",
    intro3: "Since you're here...",
  };

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
      let newFacts = await getMessage();
      newFacts = newFacts.filter((fact) => !shownFacts.has(fact));
      setFacts(newFacts);
    };

    fetchFacts();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let timeout;

    if (phase.startsWith("intro")) {
      const introMessage = introMessages[phase];
      if (charIndex < introMessage.length) {
        timeout = setTimeout(() => {
          setCurrentMessage((prev) => prev + introMessage[charIndex]);
          setCharIndex((prev) => prev + 1);
        }, 40);
      } else {
        timeout = setTimeout(() => {
          setCharIndex(0);
          setCurrentMessage("");

          if (phase === "intro1") {
            setPhase("intro2");
          } else if (phase === "intro2") {
            setPhase("intro3");
          } else {
            setPhase("facts");
          }
        }, 3000);
      }
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isVisible, phase]);

  useEffect(() => {
    if (!isVisible || phase !== "facts" || facts.length === 0) return;
    let typingTimeout;

    const currentFact = facts[messageIndex];

    if (charIndex === 0 && currentFact && !shownFacts.has(currentFact)) {
      setShownFacts((prev) => {
        const updated = new Set(prev);
        updated.add(currentFact);
        localStorage.setItem("shownFacts", JSON.stringify([...updated]));
        return updated;
      });
    }

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
          let newFacts = await getMessage();
          newFacts = newFacts.filter((fact) => !shownFacts.has(fact));

          if (newFacts.length === 0) {
            setShownFacts(new Set());
            localStorage.removeItem("shownFacts");
            newFacts = await getMessage();
          }

          setFacts(newFacts);
          setMessageIndex(0);
        }

        setCharIndex(0);
        setCurrentMessage("");
      }, 5000);
    }

    return () => clearTimeout(typingTimeout);
  }, [charIndex, messageIndex, facts, isVisible, shownFacts, phase]);

  return (
    <div className="flex-center">
      <div className="container">
        {currentMessage}
      </div>
    </div>
  );
}

export default Messages;