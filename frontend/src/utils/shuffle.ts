type SeedInput = {
  studentId?: number | null;
  roomId?: number | null;
  examId?: number | null;
  sessionKey?: string;
};

export function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), t | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffleWithSeed<T>(items: T[], seed: number): T[] {
  const arr = items.slice();
  const rand = mulberry32(seed);
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function getAttemptShuffleSeed(input: SeedInput): number {
  const studentId = Number(input.studentId);
  if (Number.isFinite(studentId) && studentId > 0) {
    const roomSeed = Number(input.roomId) | 0;
    const examSeed = Number(input.examId) | 0;
    return (studentId ^ roomSeed ^ (examSeed << 1)) >>> 0;
  }

  const key =
    input.sessionKey ||
    (Number.isFinite(Number(input.roomId))
      ? `room-shuffle-seed:${Number(input.roomId)}`
      : "room-shuffle-seed:default");
  if (typeof sessionStorage !== "undefined") {
    const existing = sessionStorage.getItem(key);
    if (existing) {
      const parsed = Number(existing);
      if (Number.isFinite(parsed)) return parsed >>> 0;
    }
    const randomSeed = Math.floor(Math.random() * 0xffffffff);
    sessionStorage.setItem(key, String(randomSeed));
    return randomSeed >>> 0;
  }
  return Math.floor(Math.random() * 0xffffffff) >>> 0;
}

type QuestionLike = {
  questionId: number;
  choices: Array<{ id: number }>;
};

export function shuffleQuestionsAndChoices<T extends QuestionLike>(
  items: T[],
  opts: {
    seed: number;
    shuffleQuestions?: boolean;
    shuffleChoices?: boolean;
    sortBase?: boolean;
  }
): T[] {
  const shuffleQ = !!opts.shuffleQuestions;
  const shuffleC = !!opts.shuffleChoices;
  const base = opts.sortBase === false
    ? items.slice()
    : items
        .slice()
        .sort(
          (a, b) => Number(b.questionId || 0) - Number(a.questionId || 0)
        );
  let list = shuffleQ ? shuffleWithSeed(base, opts.seed) : base;
  if (shuffleC) {
    list = list.map((q, idx) => ({
      ...q,
      choices: shuffleWithSeed(
        q.choices,
        opts.seed + (q.questionId | 0) + idx + 1
      ),
    }));
  }
  return list;
}
