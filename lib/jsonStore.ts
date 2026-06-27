import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

export async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readData<T>(fileName: string, defaultValue: T): Promise<T> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, fileName);

  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch (err: any) {
    if (err?.code === "ENOENT") {
      await writeData(fileName, defaultValue);
      return defaultValue;
    }
    throw err;
  }
}

export async function writeData<T>(fileName: string, data: T): Promise<void> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, fileName);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

export function generateId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2,9)}`;
}
