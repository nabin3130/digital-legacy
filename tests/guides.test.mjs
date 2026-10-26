import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { parseGuide, getPublishedGuides, getPublishedGuide, getRelatedGuides, getGuideHeadings, assignGuideHeadingIds, getGuideIndexUpdated } from '../lib/guides.ts';
import { remark } from 'remark';

const source = `---
title: "테스트 안내"
description: "안내 설명"
date: "2026-10-25"
updated: "2026-10-26"
tags: ["시작하기"]
faq:
  - question: "무엇부터 하나요?"
    answer: "목적을 정하세요."
---
먼저 목적을 정하세요. 조건은 공식 안내에서 확인하세요.

## 기록 확인

기록을 확인합니다.
`;

test('frontmatter, Korean lead, optional fields and FAQ parse correctly', () => {
  const guide = parseGuide(source, 'sample-guide');
  assert.equal(guide.updated, '2026-10-26');
  assert.equal(guide.faq[0].answer, '목적을 정하세요.');
  assert.equal(guide.lead, '먼저 목적을 정하세요. 조건은 공식 안내에서 확인하세요.');
  assert.equal(guide.draft, false);
});

test('invalid metadata fails instead of silently publishing incorrect values', () => {
  for (const invalid of [
    source.replace('date: "2026-10-25"', 'date: "2026-02-30"'),
    source.replace('updated: "2026-10-26"', 'updated: "2026-10-24"'),
    source.replace('tags: ["시작하기"]', 'tags: "시작하기"'),
    source.replace('tags: ["시작하기"]', 'draft: "true"'),
    source.replace('title: "테스트 안내"', 'title: ""'),
  ]) assert.throws(() => parseGuide(invalid, 'sample'));
  assert.throws(() => parseGuide(source, '../../outside'));
});

test('article supplies its own H1 and requires a direct-answer lead', () => {
  assert.throws(() => parseGuide(source.replace('## 기록 확인', '# 제목'), 'sample'));
  assert.throws(() => parseGuide(source.replace('먼저 목적을 정하세요. 조건은 공식 안내에서 확인하세요.', '## 시작'), 'sample'));
});

test('Korean and duplicate heading IDs match rendered AST; code fences are ignored', () => {
  const body = '## 같은 **제목**\n\n### 같은 제목\n\n## guide-faq\n\n```md\n## 가짜 제목\n```';
  const headings = getGuideHeadings(body);
  assert.deepEqual(headings.map(h => h.id), ['같은-제목', '같은-제목-2', 'guide-faq-2']);
  const tree = remark().parse(body);
  assignGuideHeadingIds(tree);
  assert.equal(tree.children[0].data.hProperties.id, headings[0].id);
});

test('drafts are excluded from all public lookups and related links; traversal cannot read files', () => {
  const previous = process.cwd();
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'logout-guides-'));
  try {
    const content = path.join(directory, 'content/guides');
    fs.mkdirSync(content, { recursive: true });
    fs.writeFileSync(path.join(content, 'published.md'), source);
    fs.writeFileSync(path.join(content, 'related.md'), source);
    fs.writeFileSync(path.join(content, 'secret-draft.md'), source.replace('tags: ["시작하기"]', 'draft: true'));
    process.chdir(directory);
    assert.deepEqual(getPublishedGuides().map(g => g.slug), ['published', 'related']);
    assert.equal(getPublishedGuide('secret-draft'), undefined);
    assert.equal(getPublishedGuide('../../etc/passwd'), undefined);
    assert.deepEqual(getRelatedGuides(getPublishedGuide('published')).map(g => g.slug), ['related']);
    assert.equal(getGuideIndexUpdated(getPublishedGuides()), '2026-10-26');
  } finally {
    process.chdir(previous);
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test('published samples have answer leads, FAQ, sources and at least two related articles', () => {
  const guides = getPublishedGuides();
  assert.equal(guides.length, 3);
  for (const guide of guides) {
    assert.ok(guide.lead.split(/(?<=[.!?])\s+/).length >= 2);
    assert.ok(guide.faq.length >= 2);
    assert.match(guide.body, /## 출처/);
    assert.match(guide.body, /https:\/\//);
    assert.equal(getRelatedGuides(guide).length, 2);
  }
});
