document.addEventListener("DOMContentLoaded", function () {
    let userData = [];
    const userGrid = document.getElementById("userGrid");
    const searchField = document.getElementById("searchField");
    const companyFilter = document.getElementById("companyFilter");
    const modalWindow = document.getElementById("modalWindow");
    const userDetails = document.getElementById("userDetails");
    const closeModal = document.getElementById("closeModal");

    const xhrRequest = new XMLHttpRequest();
    xhrRequest.open('GET', 'https://jsonplaceholder.typicode.com/users', true);

    xhrRequest.onload = function () {
        if (xhrRequest.status === 200) {
            try {
                userData = JSON.parse(xhrRequest.responseText);
                renderUsers(userData);
                populateCompanyFilter(userData);
            } catch (error) {
                console.error("Failed to parse JSON: ", error);
            }
        } else {
            console.error("Data loading error: ", xhrRequest.statusText);
        }
    };

    xhrRequest.onerror = function () {
        console.error("Network error: Unable to fetch data.");
    };

    xhrRequest.send();

    function renderUsers(users) {
        userGrid.innerHTML = "";
        users.forEach(user => {
            const userCard = document.createElement('div');
            userCard.className = "bg-white p-4 rounded shadow hover:bg-gray-200 cursor-pointer";
            userCard.innerHTML = `
                <h2 class="text-xl font-bold">${user.name}</h2>
                <p>${user.email}</p>
                <p>${user.company.name}</p>
            `;
            userCard.addEventListener("click", () => displayUserInfo(user));
            userGrid.appendChild(userCard);
        });
    }

    function populateCompanyFilter(users) {
        const companies = [...new Set(users.map(user => user.company.name))];
        companies.forEach(company => {
            const optionElement = document.createElement('option');
            optionElement.value = company;
            optionElement.textContent = company;
            companyFilter.appendChild(optionElement);
        });
    }

    searchField.addEventListener("input", function () {
        const searchTerm = searchField.value.toLowerCase();
        const filteredUsers = userData.filter(user =>
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm)
        );
        applyFilters(filteredUsers);
    });

    companyFilter.addEventListener("change", function () {
        applyFilters(userData);
    });

    function applyFilters(userArray) {
        const searchTerm = searchField.value.toLowerCase();
        const selectedCompany = companyFilter.value;
        const filteredUsers = userArray.filter(user =>
            (user.name.toLowerCase().includes(searchTerm) || user.email.toLowerCase().includes(searchTerm)) &&
            (selectedCompany === "" || user.company.name === selectedCompany)
        );
        renderUsers(filteredUsers);
    }

    function displayUserInfo(user) {
        userDetails.innerHTML = `
            <h2 class="text-2xl font-bold">${user.name}</h2>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Username:</strong> ${user.username}</p>
            <p><strong>Phone:</strong> ${user.phone}</p>
            <p><strong>Website:</strong> <a href="http://${user.website}" target="_blank">${user.website}</a></p>
            <p><strong>Company:</strong> ${user.company.name}</p>
            <p><strong>Catchphrase:</strong> ${user.company.catchPhrase}</p>
            <p><strong>Business:</strong> ${user.company.bs}</p>
            <p><strong>Address:</strong> ${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}</p>
        `;
        modalWindow.classList.remove("hidden");
        document.body.classList.add("blurred"); // Apply the blur effect to the body
    }

    closeModal.addEventListener("click", function () {
        modalWindow.classList.add("hidden");
        document.body.classList.remove("blurred"); // Remove the blur effect when closing
    });
});

