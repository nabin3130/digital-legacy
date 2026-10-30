import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import test from "node:test";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => readFileSync(path.join(root, file), "utf8");

test("Korean and English home pages offer the same two primary paths", () => {
  const ko = read("app/page.tsx");
  const en = read("app/en/page.tsx");
  assert.match(ko, /href="\/prepare"/);
  assert.match(ko, /href="\/after"/);
  assert.match(en, /href="\/en\/prepare"/);
  assert.match(en, /href="\/en\/after"/);
});

test("canonical hubs and English parity are available", () => {
  for (const file of ["app/prepare/page.tsx", "app/after/page.tsx", "app/en/prepare/page.tsx", "app/en/after/page.tsx"]) {
    assert.ok(read(file).includes("ContentHub"), `${file} should render the shared numbered hub`);
  }
  assert.match(read("components/SiteHeader.tsx"), /돌아가신 뒤/);
  assert.match(read("components/SiteHeader.tsx"), /Templates/);
});

test("account-finding guidance links Korean official sources and distinguishes account requests", () => {
  const guide = read("content/guides/korea-find-digital-accounts.md");
  assert.match(guide, /gov\.kr\/mw\/AA020InfoCappView/);
  assert.match(guide, /support\.google\.com/);
  assert.match(guide, /support\.apple\.com/);
  assert.match(guide, /로그인 권한이나 상속 여부를 판정하지 않습니다/);
});

test("six printable A4 template files exist and contain valid PDF headers", () => {
  const directory = path.join(root, "public/templates");
  const files = readdirSync(directory).filter((name) => name.endsWith(".pdf"));
  assert.equal(files.length, 6);
  for (const file of files) {
    const bytes = readFileSync(path.join(directory, file));
    assert.equal(bytes.subarray(0, 5).toString("ascii"), "%PDF-");
    assert.ok(bytes.length > 8_000, `${file} should contain the printable form`);
  }
});
