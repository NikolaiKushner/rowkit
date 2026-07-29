---
'rowkit': minor
---

Add the `useClientSort` composable and remove `DataTable`'s `sortMode` prop. The table no longer sorts its own rows under any setting — it reports the sort and renders what it is handed, so a server-paged table cannot silently reorder just the page on screen and look sorted while being wrong. Local sorting now lives outside the component, where it is testable without mounting.

Add `row:click`, which puts rows in the tab order and activates them on Enter and Space; a click on a control inside the row does not fire it. Add a `#loading` slot alongside `#empty`.
