async function loadHistory() {

    const { data, error } =
        await supabaseClient
            .from("attendance_logs")
            .select("*")
            .order("log_time", {
                ascending: false
            });

    if (error) {

        console.error(error);

        return;
    }

    let html = "";

    data.forEach(log => {

        const dateTime =
            new Date(
                log.log_time
            ).toLocaleString();

        html += `

        <tr>

            <td>
                ${log.employee_name}
            </td>

            <td>
                ${log.action}
            </td>

            <td>
                ${dateTime}
            </td>

        </tr>

        `;
    });

    document.getElementById(
        "historyTable"
    ).innerHTML = html;
}

loadHistory();

setInterval(
    loadHistory,
    5000
);
