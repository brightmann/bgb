import React from "react";
import Link from "next/link";

export const PER_PAGE = 5;

function pageNumbers(curr, total) {
  const set = new Set([1, total, curr - 1, curr, curr + 1]);
  return [...set].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
}

export function paginate(items, pageParam) {
  const list = items || [];
  const total = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const curr = Math.min(Math.max(parseInt(pageParam) || 1, 1), total);
  return {
    curr,
    total,
    posts: list.slice((curr - 1) * PER_PAGE, curr * PER_PAGE),
  };
}

function Pagination({ curr, total }) {
  if (!total || total <= 1) return null;
  const nums = pageNumbers(curr, total);
  const children = [];
  children.push(
    curr > 1 ? (
      <li key="prev">
        <Link href={`?page=${curr - 1}`}>Previous</Link>
      </li>
    ) : (
      <li key="prev" className="uk-disabled">
        <span>Previous</span>
      </li>
    )
  );
  let prev = 0;
  for (const n of nums) {
    if (n - prev > 1) {
      children.push(
        <li key={`gap-${n}`} className="uk-disabled">
          <span>...</span>
        </li>
      );
    }
    children.push(
      n === curr ? (
        <li key={n} className="uk-active">
          <span>{n}</span>
        </li>
      ) : (
        <li key={n}>
          <Link href={`?page=${n}`}>{n}</Link>
        </li>
      )
    );
    prev = n;
  }
  children.push(
    curr < total ? (
      <li key="next">
        <Link href={`?page=${curr + 1}`}>Next</Link>
      </li>
    ) : (
      <li key="next" className="uk-disabled">
        <span>Next</span>
      </li>
    )
  );
  return (
    <ul className="uk-pagination uk-flex-center uk-margin-medium-top">
      {children}
    </ul>
  );
}

export default Pagination;
