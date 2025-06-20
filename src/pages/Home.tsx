import { useEffect, useState } from "react";

type IntroPhase = "intro1" | "intro2" | "intro3";
type Phase = IntroPhase | "facts";

const introMessages: Record<IntroPhase, string> = {
  intro1: "Hey there, welcome!",
  intro2: "You’ve landed here — among the vast galaxy of the internet, you’ve found this little star of a website.",
  intro3: "Well, since you made it here...",
};

function Home() {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageIndex, setMessageIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [facts, setFacts] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [shownFacts, setShownFacts] = useState<Set<string>>(() => {
    const stored = localStorage.getItem("shownFacts");
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });
  const [phase, setPhase] = useState<Phase>("intro1");

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
      try {
        const res = await fetch('/.netlify/functions/facts');
        if (!res.ok) throw new Error('Failed to fetch facts');
        const newFacts: string[] = await res.json();
        const filteredFacts = newFacts.filter((fact) => !shownFacts.has(fact));
        setFacts(filteredFacts);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFacts();
  }, [shownFacts]);

  useEffect(() => {
    if (!isVisible) return;
    let timeout: ReturnType<typeof setTimeout>;

    if (phase.startsWith("intro")) {
      const introPhase = phase as IntroPhase;
      const introMessage = introMessages[introPhase];
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
    let typingTimeout: ReturnType<typeof setTimeout>;

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
          try {
            const res = await fetch('/.netlify/functions/facts');
            if (!res.ok) throw new Error('Failed to fetch facts');
            let newFacts: string[] = await res.json();
            newFacts = newFacts.filter((fact) => !shownFacts.has(fact));

            if (newFacts.length === 0) {
              setShownFacts(new Set());
              localStorage.removeItem("shownFacts");
              const resRetry = await fetch('/.netlify/functions/facts');
              newFacts = await resRetry.json();
            }

            setFacts(newFacts);
            setMessageIndex(0);
          } catch (error) {
            console.error(error);
          }
        }

        setCharIndex(0);
        setCurrentMessage("");
      }, 5000);
    }

    return () => clearTimeout(typingTimeout);
  }, [charIndex, messageIndex, facts, isVisible, shownFacts, phase]);

  return (
    <div className="flex justify-center items-center px-8">
      <div className="w-full max-w-2xl text-xl py-40">
        {currentMessage}
      </div>
    </div>
  );
}

export default Home;