import { test, expect } from "@jest/globals";
import * as url from "node:url";
import * as path from "node:path";
import { PDFLoader } from "../fs/pdf.js";

test("Test PDF loader from file", async () => {
  const filePath = path.resolve(
    path.dirname(url.fileURLToPath(import.meta.url)),
    "./example_data/1706.03762.pdf"
  );
  const loader = new PDFLoader(filePath);
  const docs = await loader.load();

  expect(docs.length).toBe(15);
  expect(docs[0].pageContent).toContain("Attention Is All You Need");
});

test("Test PDF loader from file to single document", async () => {
  const filePath = path.resolve(
    path.dirname(url.fileURLToPath(import.meta.url)),
    "./example_data/1706.03762.pdf"
  );
  const loader = new PDFLoader(filePath, { splitPages: false });
  const docs = await loader.load();

  expect(docs.length).toBe(1);
  expect(docs[0].pageContent).toContain("Attention Is All You Need");
});

test("Test PDF loader from file using custom pdfjs", async () => {
  if (process.version.startsWith("v20")) {
    // `pdfjs-dist` doesn't support Node 20 (`canvas` doesn't support Node 20)
    return;
  }
  const filePath = path.resolve(
    path.dirname(url.fileURLToPath(import.meta.url)),
    "./example_data/1706.03762.pdf"
  );
  const loader = new PDFLoader(filePath, {
    pdfjs: () =>
      import("pdfjs-dist/legacy/build/pdf.js").then((mod) => mod.default),
  });
  const docs = await loader.load();

  expect(docs.length).toBe(15);
  expect(docs[0].pageContent).toContain("Attention Is All You Need");
});
