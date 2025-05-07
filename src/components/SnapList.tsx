import React, { useEffect, useRef, useState } from "react";

interface ScrollSnapListProps {
  items: string[];
}

const ScrollSnapList: React.FC<ScrollSnapListProps> = ({ items }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<React.RefObject<HTMLDivElement>>>([]);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    itemRefs.current = items.map(
      (_, i) => itemRefs.current[i] || React.createRef<HTMLDivElement>()
    );
  }, [items]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      let closestIndex = 0;
      let closestDistance = Infinity;

      itemRefs.current.forEach((ref, index) => {
        const el = ref.current;
        if (el) {
          const offset = Math.abs(el.offsetTop - scrollTop);
          if (offset < closestDistance) {
            closestDistance = offset;
            closestIndex = index;
          }
        }
      });

      setActiveIndex(closestIndex);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-[500px] overflow-y-auto snap-y snap-mandatory space-y-4 px-4"
    >
      {items.map((item, index) => (
        <div
          key={index}
          ref={itemRefs.current[index]}
          className={`snap-start p-4 rounded-xl shadow-md transition duration-300 ${
            index === activeIndex
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-black"
          }`}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

export default ScrollSnapList;
