---
'rowkit': minor
---

Add `Toast` — `useToast()` for calling one from anywhere including outside a component, a module-level queue, and a `<Toaster />` mounted once to render it. Built on Reka UI's Toast, which supplies the countdown, hover-pause, swipe-to-dismiss and an F8 shortcut that moves focus into the notification region; rowkit owns the queue rules on top.

Five queue rules, each tested: at most `max` visible with the overflow waiting FIFO and no countdown until it appears, hover pausing only the hovered toast, `duration: 0` never auto-dismissing or blocking the queue, and a duplicate message inside 300ms coalescing rather than stacking. Everything announces politely — **danger toasts never become `role="alert"`**, because interrupting a screen reader mid-sentence costs more than hearing the error a moment later.
