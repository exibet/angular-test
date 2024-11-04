### Short description:

1. Create an array of forms and submit them as one.
2. After submitting the forms, display a timer and provide the option to cancel the submission.
3. Create Directive for tooltip.

### Detailed description:

- Create a page with form cards and a Submit button. Each card should have three inputs.

- First input, Country should be a text input. While the user types, it should suggest values from the Country enum (`src/app/shared/enum/country.ts`). It should validate and not allow submitting forms with values not listed in the Country enum.

- Second input, Username should be a text input with backend validation. After the user stops typing, the value from this input should be sent to `/api/checkUsername`. If the backend responds with `{isAvailable: true}`, it means that the username is available. If the backend responds with `{isAvailable: false}`, the user should choose another username.
  - To emulate the backend, all requests are handled by an interceptor. If you need to get `{isAvailable: true}`, the value sent to `/api/checkUsername` should include the word `new`. In other cases, `/api/checkUsername` returns `{isAvailable: false}`.

- Third input, Birthday, just a datepicker. Birthdays cannot be after the current date.

- Create a directive for input validation message. If validation fails, the directive should mark the input and add text below the input: 'Please provide a correct Country/Username/Birthday' (depending on which input validation fails).

- If there are invalid forms, show their amount next to the Submit button.

- A large button next to the form should create another form identical to the first one. Multiple forms can be created (up to 10).

- A small "x" button in the right corner of each form card should delete that form card.

- The "Submit all forms" button should block all forms from editing and trigger the timer (set it to 5 seconds). The "Submit all forms" button should change to a "Cancel" button. Display the timer next to the button.

- If the user presses "Cancel," the timer stops, and the user can edit all forms again. If the timer runs out, the values from all forms should be sent to the `/api/submitForm` endpoint, the forms should be cleared, the timer should disappear, and the "Cancel" button should change back to the "Submit all forms" button.

### Acceptance criteria:

- All form validations work.
- Tooltip directive works.
- Amount of invalid forms shown.
- Adding more form cards works.
- Removing form cards works.
- Submit with timer works.
- Cancel submit works.
