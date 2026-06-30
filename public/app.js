const form = document.getElementById("form");
const input = document.getElementById("url");
const result = document.getElementById("result");
const shortLink = document.getElementById("short-link");
const copyBtn = document.getElementById("copy");
const errorEl = document.getElementById("error");

form.addEventListener("submit", async(event) => {
    event.preventDefault();
    errorEl.textContent = "";
    result.hidden = true;

    try {
        const response = await fetch("/api/shorten", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({url: input.value}),
        });

        const data = await response.json();

        if(!response.ok) throw new Error(data.error || "Something went wrong");

        shortLink.textContent = data.shortUrl;
        shortLink.href = data.shortUrl;
        result.hidden = false;
        input.value = "";
  } catch (err) {
    errorEl.textContent = err.message;
  }
})

copyBtn.addEventListener("click", async () => {
  await navigator.clipboard.writeText(shortLink.textContent);
  copyBtn.textContent = "Copied!";
  setTimeout(() => (copyBtn.textContent = "Copy"), 1500);
});