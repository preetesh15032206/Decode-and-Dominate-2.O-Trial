export interface Team {
  id: string; // digits
  password: string; // digits
}

export interface QuestionR1 {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number; // index
}

export interface SnippetR2 {
  id: string;
  code: string;
  language: string;
}

const DEFAULT_TEAMS: Team[] = [
  { id: "12345", password: "123" }
];

const DEFAULT_QUESTIONS_R1: QuestionR1[] = [
  {
    id: "1",
    text: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Hyper Transfer Markup Language",
      "High Text Modern Language"
    ],
    correctAnswer: 0
  }
];

const DEFAULT_SNIPPETS_R2: SnippetR2[] = [
  {
    id: "1",
    language: "javascript",
    code: `// Fix the following JavaScript function
function calculateSum(numbers) {
    let total = 0;
    for (let i = 0; i <= numbers.length; i++) {
        total += numbers[i];
    }
    return total;
}

// Test case that should return 15
console.log(calculateSum([1, 2, 3, 4, 5]));`
  }
];

export const getStoreData = (key: string, defaultValue: any) => {
  if (typeof window === 'undefined') return defaultValue;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

export const setStoreData = (key: string, value: any) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
};

export const getTeams = (): Team[] => getStoreData("admin_teams", DEFAULT_TEAMS);
export const setTeams = (teams: Team[]) => setStoreData("admin_teams", teams);

export const getQuestionsR1 = (): QuestionR1[] => getStoreData("admin_q1", DEFAULT_QUESTIONS_R1);
export const setQuestionsR1 = (q: QuestionR1[]) => setStoreData("admin_q1", q);

export const getSnippetsR2 = (): SnippetR2[] => getStoreData("admin_q2", DEFAULT_SNIPPETS_R2);
export const setSnippetsR2 = (s: SnippetR2[]) => setStoreData("admin_q2", s);
