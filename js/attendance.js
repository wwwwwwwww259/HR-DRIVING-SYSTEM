let currentEmployee = null;

async function searchEmployee() {

    const employeeId =
        document.getElementById(
            "searchEmployee"
        ).value.trim();

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

    renderEmployeeCard();
}

function renderEmployeeCard(){

    let tripButtons = "";

    if(
        currentEmployee.employee_type ===
        "driver"
    ){

        tripButtons = `

        <button
            class="btn btn-dark"
            onclick="startTrip()">

            START TRIP

        </button>

        <button
            class="btn btn-secondary"
            onclick="endTrip()">

            END TRIP

        </button>

        `;
    }

    document.getElementById(
        "employeeCard"
    ).innerHTML = `

    <div class="card p-4">

        <h3>
            ${currentEmployee.full_name}
        </h3>

        <p>
            Employee ID:
            ${currentEmployee.employee_id}
        </p>

        <p>
            Position:
            ${currentEmployee.position}
        </p>

        <p>
            Status:
            <strong>
            ${currentEmployee.status}
            </strong>
        </p>

        <button
            class="btn btn-success"
            onclick="timeIn()">

            TIME IN

        </button>

        <button
            class="btn btn-warning"
            onclick="toggleBreak()">

            BREAK

        </button>

        <button
            class="btn btn-danger"
            onclick="timeOut()">

            TIME OUT

        </button>

        <hr>

        ${tripButtons}

    </div>

    `;
}
