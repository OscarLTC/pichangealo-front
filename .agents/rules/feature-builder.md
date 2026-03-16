---
trigger: manual
---

[GLOBAL_MODULE_RULES]

1. Work only inside the requested module content area.
2. Do not modify the global layout:
   - do not touch sidebar
   - do not touch topbar
   - do not change the shell structure
3. Treat the current shell layout as fixed and approved.
4. Only improve and build the internal module content.

[STACK_RULES]

1. Use React + TypeScript + Vite as the base stack.
2. Use TailwindCSS v4 for styling.
3. Use `clsx`, `tailwind-merge`, and `class-variance-authority` for class composition and variants.
4. Use `lucide-react` for icons.
5. Use `react-router` only when routing integration is needed.
6. Do not assume libraries that are not installed.
7. If a missing dependency is required, explicitly mention it before using it.

[CODE_NAMING_RULES]

1. All file names must be in English.
2. All variable names, function names, component names, constants, props, hooks and types must be in English.
3. All user-facing visible text must be in Spanish.
4. Follow clean code principles:
   - clear naming
   - small functions
   - focused components
   - avoid complex logic inside JSX

[MODULE_STRUCTURE_RULES]

1. Work by feature/module.
2. Keep file organization clean and scalable.
3. Separate:
   - pages
   - components
   - hooks
   - types
   - constants
   - utils
4. Avoid giant files with multiple responsibilities.
5. Extract reusable parts when appropriate.

[UI_COMPONENT_RULES]

1. Prefer reusable UI components built with TailwindCSS.
2. Use `class-variance-authority` for variants when appropriate.
3. Use `clsx` + `tailwind-merge` to compose class names safely.
4. Keep visual consistency with the existing product language.
5. Reuse visual patterns instead of duplicating markup/styles.

[SHADCN_RULES]

1. The project includes shadcn tooling, but do not assume all shadcn components already exist.
2. Before using shadcn components, check if they are present in the project.
3. If they do not exist, either:
   - build the component with Tailwind,
   - or explicitly mention that it should be generated first.
4. Do not import non-existing shadcn components by assumption.

[HTML_REFERENCE_RULES]

1. Treat provided HTML files as functional and structural references for the module content.
2. Do not copy them blindly if the internal structure can be improved.
3. Preserve the intended behavior and improve composition, hierarchy and componentization.
4. Do not use the HTML reference to alter the global layout.

[UX_FUNCTIONAL_RULES]

1. Prioritize ease of management.
2. Ease of management does not mean removing important actions.
3. Keep all necessary actions required to achieve the module goal.
4. Show only the necessary overview information in main screens.
5. Move richer information into details, drawers or modals.
6. Avoid empty screens and avoid overloading the user.

[FORM_RULES]

1. Do not assume `react-hook-form` or `zod` are installed.
2. Build forms with controlled React state unless another solution already exists in the codebase.
3. Keep validation logic simple and modular.
4. Use user-facing labels and messages in Spanish.
5. Keep forms well organized and focused.

[STATE_RULES]

1. Do not assume Zustand is installed.
2. Prefer local state or lifted state when possible.
3. Use React Context only when truly needed.
4. Avoid adding a global state solution unless necessary.

[DATE_AND_INTERACTION_RULES]

1. Do not assume `dayjs`, `date-fns`, `dnd-kit`, or similar libraries are installed.
2. Use native Date utilities unless another date library is explicitly present.
3. Do not implement advanced drag/resize behaviors with missing libraries unless you first state that the dependency is missing.
4. Prefer simpler maintainable interactions first.

[VISUAL_RULES]

1. Keep the style modern, clean, minimal and professional.
2. Improve clarity, hierarchy and spacing rather than adding decorative noise.
3. Keep consistency with the current admin panel.
4. Do not redesign the global shell.
5. Improve the module, not the shell.

[FORM_AND_MODAL_RULES]

1. Keep create/edit flows contextual when possible.
2. Prefer modal or drawer for create/edit if it helps preserve context.
3. Keep forms structured, clear and easy to complete.

[BEHAVIOR_PRESERVATION_RULES]

1. Preserve the intended interaction model already defined in the module.
2. Improve structure and presentation without breaking the expected flow.
3. Refine what already works instead of replacing it unnecessarily.

[FUNCTIONAL_PRIORITY_RULES]

1. Prioritize usability over novelty.
2. Prioritize management flow over decoration.
3. Keep overview screens concise.
4. Keep primary actions obvious and secondary actions accessible but not dominant.
