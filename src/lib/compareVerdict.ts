import type { Equipment } from "@/data/equipment";

const parseWatts = (w?: string) => {
  if (!w) return null;
  const m = w.replace(/,/g, "").match(/\d+(\.\d+)?/);
  return m ? Number(m[0]) : null;
};

const colourSentence = (e: Equipment): string | null => {
  const c = (e.color ?? "").toLowerCase();
  if (!c) return null;
  if (c.includes("rgb"))
    return "you need full colour control and more creative flexibility — gels, effects and matching mixed practicals without carrying a bag of filters";
  if (c.includes("bi"))
    return "you need a powerful adjustable white source and primarily work with controlled colour temperatures";
  if (c.includes("daylight") || c.includes("tungsten"))
    return `you want maximum ${c.includes("daylight") ? "daylight" : "tungsten"} output and punch for a single, consistent colour temperature`;
  return null;
};

const isLight = (e: Equipment) =>
  ["COB Lights", "Mat Lights", "Tube Lights", "Panel Lights"].includes(e.category);

const shapeSentence = (e: Equipment): string => {
  switch (e.category) {
    case "COB Lights":
      return "you want a hard point source you can shape with a softbox, fresnel or projection lens";
    case "Panel Lights":
      return "you want a large, soft source straight out of the box for interviews and beauty work";
    case "Mat Lights":
      return "you need a soft, flexible source that folds away and can be taped or rigged anywhere";
    case "Tube Lights":
      return "you want accent, edge and in-frame colour rather than a key light";
    case "Stands & Grips":
      return "your priority is safely supporting and positioning gear on set";
    default:
      return "it fits the specific job described in its use case";
  }
};

/**
 * A plain-language final verdict for one item, written with awareness of the
 * item it is being compared against.
 */
export const compareVerdict = (item: Equipment, other?: Equipment): string => {
  const parts: string[] = [];

  const colour = colourSentence(item);
  if (colour) parts.push(colour);
  else parts.push(shapeSentence(item));

  if (isLight(item)) {
    const mine = parseWatts(item.watts);
    const theirs = other ? parseWatts(other.watts) : null;
    if (mine && theirs && mine !== theirs) {
      parts.push(
        mine > theirs
          ? "you need the extra output for larger spaces, bigger modifiers or fighting daylight"
          : "you want a lighter, lower draw fixture that is easier to power and move"
      );
    } else if (colour) {
      parts.push(shapeSentence(item));
    }
  }

  const sentence = parts.join(", and ");
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
};
