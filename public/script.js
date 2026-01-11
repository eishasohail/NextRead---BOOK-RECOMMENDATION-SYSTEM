document.addEventListener("DOMContentLoaded", () => {
    const recommendBtn = document.getElementById("recommendBtn");
    const userInput = document.getElementById("userInput");
    const recommendationDiv = document.getElementById("recommendation");
    const booksGrid = document.getElementById("booksGrid");
    const btnText = document.getElementById("btnText");
    const btnLoader = document.getElementById("btnLoader");

    recommendBtn.addEventListener("click", async () => {
        const inputText = userInput.value.trim();
        if (!inputText) {
            alert("Please enter your preferences.");
            return;
        }

        // Loader on
        btnText.classList.add("hidden");
        btnLoader.classList.remove("hidden");
        btnLoader.classList.add("flex");
        recommendBtn.disabled = true;
        recommendationDiv.classList.add("hidden");

        try {
            const response = await axios.get(`/recommend?input=${encodeURIComponent(inputText)}`);
            const books = response.data;

            booksGrid.innerHTML = books.map(book => `
                <div class="bg-white/70 backdrop-blur-md border border-white/60 rounded-2xl p-8 shadow-lg hover:shadow-xl hover:border-violet-200 transition-all duration-300">
                    <h3 class="text-2xl font-bold text-gray-900 mb-2">${book.title}</h3>
                    <p class="text-violet-600 font-medium text-lg mb-4">by ${book.author}</p>
                    <p class="text-gray-600 text-base leading-relaxed">${book.description}</p>
                </div>
            `).join("");

            recommendationDiv.classList.remove("hidden");

        } catch (error) {
            console.error(error);
            booksGrid.innerHTML = `
                <div class="bg-red-50/80 backdrop-blur-md border border-red-100 rounded-2xl p-8 text-center">
                    <p class="text-red-600 text-xl font-medium">
                        Something went wrong. Please try again in a moment.
                    </p>
                </div>
            `;
            recommendationDiv.classList.remove("hidden");
        } finally {
            btnText.classList.remove("hidden");
            btnLoader.classList.add("hidden");
            btnLoader.classList.remove("flex");
            recommendBtn.disabled = false;
        }
    });
});
