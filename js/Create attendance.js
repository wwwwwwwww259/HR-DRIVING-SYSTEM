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

async function startTrip(){

    if(!currentEmployee){
        return;
    }

    const origin =
        prompt("Origin:");

    const destination =
        prompt("Destination:");

    if(!origin || !destination){
        return;
    }

    await supabaseClient
        .from("driver_trips")
        .insert([
            {
                driver_id:
                    currentEmployee.employee_id,

                origin: origin,

                destination: destination,

                status: "DRIVING"
            }
        ]);

    await supabaseClient
        .from("employees")
        .update({
            status: "DRIVING"
        })
        .eq(
            "employee_id",
            currentEmployee.employee_id
        );

    alert("Trip Started");

    searchEmployee();
}

async function endTrip(){

    if(!currentEmployee){
        return;
    }

    const { data } =
        await supabaseClient
            .from("driver_trips")
            .select("*")
            .eq(
                "driver_id",
                currentEmployee.employee_id
            )
            .is("end_time", null)
            .order("id", {
                ascending:false
            })
            .limit(1);

    if(!data || data.length === 0){

        alert("No Active Trip");

        return;
    }

    await supabaseClient
        .from("driver_trips")
        .update({

            end_time:
                new Date(),

            status:
                "COMPLETED"

        })
        .eq(
            "id",
            data[0].id
        );

    await supabaseClient
        .from("employees")
        .update({
            status:"AVAILABLE"
        })
        .eq(
            "employee_id",
            currentEmployee.employee_id
        );

    alert("Trip Completed");

    searchEmployee();
}
