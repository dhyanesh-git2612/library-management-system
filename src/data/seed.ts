// ============================================================
// SEED DATA — 200 Books, Locations, Default Users
// ============================================================

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  locationBlock: string;
  quantity: number;
  shelf: string;
  status: "available" | "checked-out";
  genre: string;
  description: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "user" | "librarian";
  phone: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

export interface Location {
  blockId: string;
  row: number;
  col: number;
  label: string;
  bookCount: number;
}

// ---------- Genre & Title pools ----------
const GENRES = [
  "Fiction", "Science Fiction", "Fantasy", "Mystery", "Romance",
  "Thriller", "Biography", "History", "Science", "Philosophy",
  "Poetry", "Self-Help", "Travel", "Cooking", "Art",
  "Technology", "Business", "Psychology", "Education", "Health"
];

const FIRST_NAMES = [
  "James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda",
  "David", "Elizabeth", "William", "Barbara", "Richard", "Susan", "Joseph", "Jessica",
  "Thomas", "Sarah", "Charles", "Karen", "Daniel", "Lisa", "Matthew", "Nancy",
  "George", "Betty", "Steven", "Dorothy", "Andrew", "Sandra", "Edward", "Ashley",
  "Henry", "Kimberly", "Peter", "Emily", "Frank", "Donna", "Alexander", "Michelle"
];

const LAST_NAMES = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
  "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
  "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson",
  "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
  "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen",
  "Hill", "Flores", "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera"
];

const TITLE_WORDS_A = [
  "The", "A", "An", "Beyond", "Under", "Through", "Before", "After", "Between",
  "Into", "Within", "Across", "Among", "Against", "Without", "Echoes of", "Shadows of",
  "Pathways", "Visions", "Whispers of", "Dawn of", "Rise of", "Fall of", "Return to",
  "Journey to", "Secrets of", "Heart of", "Spirit of", "Light in", "Fire in"
];

const TITLE_WORDS_B = [
  "Silent", "Golden", "Eternal", "Hidden", "Lost", "Forgotten", "Broken", "Ancient",
  "Crimson", "Wandering", "Brave", "Lonely", "Midnight", "Morning", "Final", "First",
  "Distant", "Wandering", "Iron", "Glass", "Silver", "Copper", "Stone", "Crystal",
  "Wild", "Quiet", "Gentle", "Fierce", "Noble", "Sacred", "Twisted", "Shattered"
];

const TITLE_WORDS_C = [
  "Forest", "Mountain", "River", "Ocean", "Sky", "City", "Garden", "Castle",
  "Kingdom", "Empire", "Road", "Bridge", "Tower", "Library", "Valley", "Island",
  "Desert", "Storm", "Flame", "Shadow", "Crown", "Sword", "Dream", "Mirror",
  "Window", "Door", "Gate", "Labyrinth", "Compass", "Clock", "Star", "Moon"
];

const DESCRIPTIONS = [
  "A captivating tale that explores the depths of human experience through richly drawn characters and compelling narrative.",
  "An insightful exploration of its subject matter, blending rigorous research with accessible prose.",
  "A groundbreaking work that challenges conventional thinking and offers fresh perspectives on familiar topics.",
  "This masterful book weaves together multiple storylines into a cohesive and unforgettable whole.",
  "Written with elegance and precision, this book illuminates complex ideas with clarity and grace.",
  "A powerful and moving account that resonates long after the final page is turned.",
  "Essential reading for anyone interested in understanding the forces that shape our world.",
  "Combining deep scholarship with vivid storytelling, this book is both informative and engaging.",
  "A thought-provoking examination of contemporary issues through a unique and compelling lens.",
  "This beautifully crafted book offers wisdom and insight on every page."
];

// ---------- Helper functions ----------
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const rand = seededRandom(42);

function pick<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

function pickIndex(arr: unknown[]): number {
  return Math.floor(rand() * arr.length);
}

// ---------- Generate 200 books ----------
function generateBooks(): Book[] {
  const usedTitles = new Set<string>();
  const books: Book[] = [];
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const cols = ["1", "2", "3", "4", "5", "6", "7", "8"];

  for (let i = 1; i <= 200; i++) {
    let title: string;
    do {
      const pattern = pickIndex([0, 1, 2]);
      if (pattern === 0) {
        title = `${pick(TITLE_WORDS_A)} ${pick(TITLE_WORDS_B)} ${pick(TITLE_WORDS_C)}`;
      } else if (pattern === 1) {
        title = `${pick(TITLE_WORDS_B)} ${pick(TITLE_WORDS_C)}`;
      } else {
        title = `${pick(TITLE_WORDS_A)} ${pick(TITLE_WORDS_C)}`;
      }
    } while (usedTitles.has(title));
    usedTitles.add(title);

    const firstName = pick(FIRST_NAMES);
    const lastName = pick(LAST_NAMES);
    const author = `${firstName} ${lastName}`;

    const isbn = `978-${Math.floor(rand() * 10)}-${Math.floor(rand() * 90000 + 10000)}-${Math.floor(rand() * 9000 + 1000)}-${Math.floor(rand() * 10)}`;
    const locationBlock = `${pick(rows)}${pick(cols)}`;
    const shelf = `${pick(rows)}-${Math.floor(rand() * 20 + 1)}`;
    const quantity = Math.floor(rand() * 8) + 1;
    const status = rand() > 0.3 ? "available" as const : "checked-out" as const;
    const genre = pick(GENRES);
    const description = pick(DESCRIPTIONS);

    books.push({
      id: `BK${String(i).padStart(4, "0")}`,
      title,
      author,
      isbn,
      locationBlock,
      quantity,
      shelf,
      status,
      genre,
      description
    });
  }
  return books;
}

// ---------- Default users ----------
function generateUsers(): User[] {
  return [
    {
      id: "USR001",
      name: "Admin Librarian",
      email: "librarian@library.com",
      password: "admin123",
      role: "librarian",
      phone: "+15551234567",
      emailNotifications: true,
      smsNotifications: true
    },
    {
      id: "USR002",
      name: "John Reader",
      email: "john@example.com",
      password: "user123",
      role: "user",
      phone: "+15559876543",
      emailNotifications: true,
      smsNotifications: false
    },
    {
      id: "USR003",
      name: "Jane Bookworm",
      email: "jane@example.com",
      password: "user123",
      role: "user",
      phone: "+15555551234",
      emailNotifications: true,
      smsNotifications: true
    }
  ];
}

// ---------- Locations ----------
function generateLocations(books: Book[]): Location[] {
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const cols = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const locationLabels: Record<string, string> = {
    "A": "Fiction Wing",
    "B": "Science & Tech",
    "C": "History & Biography",
    "D": "Arts & Literature",
    "E": "Children's Section",
    "F": "Reference Section",
    "G": "Periodicals",
    "H": "Special Collections"
  };

  const locations: Location[] = [];
  for (let r = 0; r < rows.length; r++) {
    for (let c = 0; c < cols.length; c++) {
      const blockId = `${rows[r]}${cols[c]}`;
      const bookCount = books.filter(b => b.locationBlock === blockId).length;
      locations.push({
        blockId,
        row: r,
        col: c,
        label: `${locationLabels[rows[r]]} — Aisle ${cols[c]}`,
        bookCount
      });
    }
  }
  return locations;
}

// ---------- Initialize & persist ----------
export function initializeData(): { books: Book[]; users: User[]; locations: Location[] } {
  const storedBooks = localStorage.getItem("lib_books");
  const storedUsers = localStorage.getItem("lib_users");

  let books: Book[];
  let users: User[];

  if (storedBooks) {
    books = JSON.parse(storedBooks);
  } else {
    books = generateBooks();
    localStorage.setItem("lib_books", JSON.stringify(books));
  }

  if (storedUsers) {
    users = JSON.parse(storedUsers);
  } else {
    users = generateUsers();
    localStorage.setItem("lib_users", JSON.stringify(users));
  }

  const locations = generateLocations(books);

  return { books, users, locations };
}

export function resetData(): { books: Book[]; users: User[]; locations: Location[] } {
  localStorage.removeItem("lib_books");
  localStorage.removeItem("lib_users");
  localStorage.removeItem("lib_session");
  return initializeData();
}
