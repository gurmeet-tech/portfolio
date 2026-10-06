
      // Contact form. Set data-form-endpoint="https://formspree.io/f/XXXX" (or any service that accepts a form POST)
      // on the <form> to send submissions there. Left empty, it opens the visitor's email app, prefilled.
      (() => {
        const EMAIL = 'ganimatemediahouse@gmail.com';
        document.querySelectorAll('form.contact-form').forEach((form) => {
          const button = form.querySelector('.contact-submit');
          const status = document.createElement('p');
          status.className = 'form-status';
          status.setAttribute('role', 'status');
          status.setAttribute('aria-live', 'polite');
          form.appendChild(status);
          const say = (message, isError) => { status.textContent = message; status.classList.toggle('error', Boolean(isError)); };
          form.querySelectorAll('[name="name"], [name="email"], [name="message"]').forEach((field) => { field.required = true; });

          form.addEventListener('submit', async (event) => {
            event.preventDefault();
            if (!form.reportValidity()) return;
            const endpoint = (form.dataset.formEndpoint || '').trim();
            const data = new FormData(form);
            if (!/^https:\/\//.test(endpoint)) {
              const body = [`Name: ${data.get('name')}`, `Email: ${data.get('email')}`, `Budget: ${data.get('budget')}`, '', data.get('message')].join('\n');
              window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Project enquiry from ' + data.get('name'))}&body=${encodeURIComponent(body)}`;
              say(`Opening your email app. If nothing opens, write to ${EMAIL}.`);
              return;
            }
            const label = button.textContent;
            button.disabled = true;
            button.textContent = 'Sendingâ€¦';
            say('');
            try {
              const response = await fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
              if (!response.ok) throw new Error(String(response.status));
              form.reset();
              say("Thanks, we've got your message and will be in touch.");
            } catch (error) {
              say(`Something went wrong. Please try again, or email ${EMAIL}.`, true);
            } finally {
              button.disabled = false;
              button.textContent = label;
            }
          });
        });
      })();
    