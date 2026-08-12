const ctx = document.getElementById("categoryChart");

new Chart(ctx, {
    type: "pie",
    data: {
        labels: ["Electronics", "Fashion", "Shoes"],
        datasets: [{
            data: [20, 15, 10],
            backgroundColor: [
                "#4e73df",
                "#1cc88a",
                "#f6c23e"
            ]
        }]
    }
});