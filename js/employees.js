console.log("EMPLOYEES JS LOADED");

function saveEmployee() {
    alert("Button Working");
}

    const employeeId =
        document.getElementById("employeeId").value;

    const fullName =
        document.getElementById("fullName").value;

    const position =
        document.getElementById("position").value;

    const department =
        document.getElementById("department").value;

    const employeeType =
        document.getElementById("employeeType").value;

    const { error } =
        await supabaseClient
        .from("employees")
        .insert([
            {
                employee_id: employeeId,
                full_name: fullName,
                position: position,
                department: department,
                employee_type: employeeType
            }
        ]);

    if(error){
        alert(error.message);
        return;
    }

    alert("Employee Saved");

    loadEmployees();
}

async function loadEmployees(){

    const { data, error } =
        await supabaseClient
        .from("employees")
        .select("*")
        .order("id",{ascending:false});

    let html = "";

    data.forEach(emp => {

        html += `
        <tr>
            <td>${emp.employee_id}</td>
            <td>${emp.full_name}</td>
            <td>${emp.position}</td>
            <td>${emp.status}</td>
        </tr>
        `;

    });

    document.getElementById(
        "employeeTable"
    ).innerHTML = html;
}

loadEmployees();
