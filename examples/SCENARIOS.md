## 1. Class Method Refactoring (Internal Dependencies)
**File:** `examples/class_refactoring.js` (formerly `test_class.js`)

**Scenario:**
Renaming a class method (`fetchData` -> `loadData`) that is called internally by another method (`process`). This tests the AST parser's ability to resolve `this.method()` calls, which regex-based tools often miss.

**Prompt:**
> `#editmath In class DataHandler, rename the method fetchData to loadData. Don't forget to update call sites.`

**Outcome:**
*   🔍 **Analysis:** The server correctly identified `fetchData` and `save` as dependencies within the class scope using Tree-sitter.
*   ⛔ **Intervention:** Strict Mode triggered because dependencies were detected. The server blocked the silent edit.
*   ✅ **Resolution:** After user confirmation, the AI renamed the method definition **AND** updated the internal call site (`this.loadData()`) in the `process` method.



## 2. TypeScript Interface Refactoring (Auto-Detection)
**File:** `examples/typescript_interface.ts` (formerly `test_types.ts`)

**Scenario:**
Renaming a property in a TypeScript interface (`username` -> `login`). This is a breaking change for all functions consuming this interface. This test verifies the server's ability to automatically detect TypeScript syntax and switch parsers.

**Prompt:**
> `#editmath Change User interface: rename 'username' field to 'login'.`

**Outcome:**
*   🔍 **Auto-Detection:** The server correctly identified the language as `typescript` based on the file extension.
*   ⛔ **Intervention:** Strict Mode blocked the edit because dependencies (`printUser`) were detected.
*   ✅ **Resolution:** After user confirmation, the AI refactored the interface definition, the consumer function (`printUser`), and the object instantiation in `main` to use the new `login` property.



## 3. External Library Interaction (Force Override)
**File:** `examples/external_library.js` (formerly `test_external.js`)

**Scenario:**
Modifying a call to an external library function (`externalLib.execute`). Since the source code of the library is not available for analysis, the AI cannot automatically verify the safety of the change. This tests the "Force Override" mechanism via user confirmation.

**Prompt:**
> `#editmath In runTask, change the argument of externalLib.execute to an object { id: "task_1" }.`

**Outcome:**
*   🔍 **Analysis:** The server detected a dependency on `execute`.
*   ⛔ **Intervention:** Strict Mode blocked the edit because `execute` is an external function and could not be verified by reading its code.
*   🗣️ **Dialogue:** The AI explained that it cannot verify the external dependency and asked for user permission to proceed with the assumption that the library supports the new argument format.
*   ✅ **Resolution:** After user confirmation (`user_confirmed=True`), the server granted access, and the AI updated the function call.



## 4. Recursive Functions (Cyclic Dependencies)
**File:** `examples/recursion.js` (formerly `test_recursion.js`)

**Scenario:**
Adding a parameter to a recursive function (`parseExpression`) that is part of a mutual recursion cycle with `parseGroup`. This tests the AI's ability to detect and refactor cyclic dependencies without breaking the call chain.

**Prompt:**
> `#editmath Change parseExpression to accept a second argument 'depth' to prevent stack overflow.`

**Outcome:**
*   🔍 **Analysis:** The server detected the dependency on `parseGroup`.
*   ⛔ **Intervention:** Strict Mode blocked the initial edit request.
*   🧠 **Reasoning:** The AI recognized the mutual recursion and realized that modifying one function signature requires updating the other to propagate the `depth` argument.
*   ✅ **Resolution:** After user confirmation, the AI atomically updated both `parseExpression` and `parseGroup`, correctly passing `depth + 1` through the recursive calls and adding the termination condition.



## 5. Observer Pattern (Indirect Calls)
**File:** `examples/observer_pattern.js` (formerly `test_observer.js`)

**Scenario:**
Changing the data structure passed to subscribers in an Observer pattern. The dependency is hidden behind a generic `callback` variable within a `forEach` loop. This tests if the AI can track down where these callbacks are defined and update them.

**Prompt:**
> `#editmath In notify(), change the argument from a string to an object { type: 'info', payload: message }.`

**Outcome:**
*   🔍 **Analysis:** The server correctly flagged the `callback(message)` call as a dependency, even though it's not a direct function call.
*   ⛔ **Intervention:** Strict Mode blocked the edit because dependencies were detected.
*   🧠 **Reasoning:** The AI realized that changing the argument type in `notify` would break all subscribers that expect a string.
*   ✅ **Resolution:** After user confirmation, the AI located the subscribers (`alertUser` and the anonymous arrow function) and updated them to access `notification.payload`, keeping the system consistent.



## 6. TypeScript Generics & Interfaces
**File:** `examples/typescript_generics.ts` (formerly `test_generics.ts`)

**Scenario:**
Renaming a property in a generic interface (`ApiResponse<T>`). This tests the server's ability to parse TypeScript syntax (generics, type annotations) and ensures the AI refactors not just the definition, but also the functions that return or consume this type.

**Prompt:**
> `#editmath Rename 'data' field to 'payload' in ApiResponse interface.`

**Outcome:**
*   🔍 **Auto-Detection:** The server correctly identified the language as `typescript` and switched to the TS parser.
*   ⛔ **Intervention:** Strict Mode blocked the edit because dependencies were detected.
*   ✅ **Resolution:** After user confirmation, the AI refactored the interface definition, the generic wrapper function (`wrapResponse`), and the consumer function (`handleUser`) to use `.payload` instead of `.data`, maintaining type safety throughout the file.