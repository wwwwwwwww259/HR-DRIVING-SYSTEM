let currentEmployee = null;

async function searchEmployee() {

    const employeeId =
        document.getElementById(
            "searchEmployee"
        ).value;

    const { data, error } =
        await supabaseClient
            .from("employees")
            .select("*")
            .eq("employee_id", employeeId)
            .single();

    if(error){

        alert("Employee Not Found");

        return;
    }

    currentEmployee = data;

    document.getElementById(
        "employeeInfo"
    ).innerHTML = `

        <div class="card p-3">

            <h4>${data.full_name}</h4>

            <p>${data.position}</p>

            <p>Status:
                <strong>
                ${data.status}
                </strong>
            </p>

            <button
                class="btn btn-success"
                onclick="recordAttendance('TIME_IN')"
            >
                Time In
            </button>

            <button
                class="btn btn-danger"
                onclick="recordAttendance('TIME_OUT')"
            >
                Time Out
            </button>

            <button
                class="btn btn-warning"
                onclick="recordAttendance('BREAK_OUT')"
            >
                Break Out
            </button>

            <button
                class="btn btn-info"
                onclick="recordAttendance('BREAK_IN')"
            >
                Break In
            </button>

        </div>

    `;
}

async function recordAttendance(action){

    if(!currentEmployee){

        return;
    }

    await supabaseClient
        .from("attendance")
        .insert([
            {
                employee_id:
                currentEmployee.employee_id,

                action: action
            }
        ]);

    let status = "OFF_DUTY";

    if(action === "TIME_IN")
        status = "AVAILABLE";

    if(action === "BREAK_OUT")
        status = "BREAK";

    if(action === "BREAK_IN")
        status = "AVAILABLE";

    if(action === "TIME_OUT")
        status = "OFF_DUTY";

    await supabaseClient
        .from("employees")
        .update({
            status: status
        })
        .eq(
            "employee_id",
            currentEmployee.employee_id
        );

    alert(action + " Recorded");

    searchEmployee();
}
