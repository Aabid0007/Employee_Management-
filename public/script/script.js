function btn_filled() {
  const btn_filled = document.getElementsByClassName("add_employee")[0];
  btn_filled.style.display = "block";
  const overlay = document.getElementsByClassName("overlay")[0];
  overlay.style.display = "block";
}


// add_employee_close_btn
function close_btn() {
  var close_btn = document.getElementsByClassName("add_employee")[0];
  close_btn.style.display = "none";
  const overlay = document.getElementsByClassName("overlay")[0];
  overlay.style.display = "none";
  clearForm();
  get_emp();
  clearErrorMessages();
}


// ---add-popup-modal-----start
function showPopup() {
  close_btn();
  var overlay = document.getElementsByClassName("overlay")[0];
  overlay.style.display = "block";
  document.getElementById("employee_add").style.display = "block";
  clearForm();
}
function closePopup() {
  document.getElementById("employee_add").style.display = "none";
  var overlay = document.getElementsByClassName("overlay")[0];
  overlay.style.display = "none";
}

// --delete-popup-modal-----start
function deleteshowPopup() {
  var overlay = document.getElementsByClassName("overlay")[0];
  overlay.style.display = "block";
  document.getElementById("employee_delete").style.display = "block";
}
function PopupDeleteclose() {
  document.getElementById("employee_delete").style.display = "none";
  var overlay = document.getElementsByClassName("overlay")[0];
  overlay.style.display = "none";
}

// --edited-popup-modal------start
function EditedshowPopup() {
  var overlay = document.getElementsByClassName("overlay")[0];
  overlay.style.display = "block";
  document.getElementById("employee_edited").style.display = "block";
  clearForm();
}
function PopupEditedclose() {
  document.getElementById("employee_edited").style.display = "none";
  var overlay = document.getElementsByClassName("overlay")[0];
  overlay.style.display = "none";
  location.reload();
  clearForm();
}


// three-dot-open-form............start
function three_dot_list(id) {
  const three_dot_list = document.getElementById("employee_action_btn");
  console.log(id);
  three_dot_list.innerHTML = `
    <a href="viewDetails?id=${id}"><button class="employee_btn view_btn"><i class="fa-solid fa-eye"></i>View Details</button></a>
    <button class="employee_btn edit_btn" onclick="edit_btn('${id}')"><i class="fa-solid fa-pen"></i>Edit</button>
    <button class="employee_btn delete_btn" onclick="open_delete_form('${id}')"><i class="fa-regular fa-trash-can"></i>Delete</button>
  `
  three_dot_list.style.display = "block";

  // three dot arrange...............................
  const moreOptionToggles = document.querySelectorAll(".three_dot_list");
  moreOptionToggles.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const buttonRect = event.target.getBoundingClientRect();
      const btnActive = document.querySelector(".employee_action_btn");
      btnActive.style.top = buttonRect.top - 210 + "px";
      btnActive.style.display =
        btnActive.style.display === "none" || btnActive.style.display === "" ? "block" : "none";
      event.stopPropagation();
    });
  });

  // screen_click_to_closing........start
  function closeMenu() {
    three_dot_list.style.display = "none";
    document.removeEventListener("mousedown", handleOutsideClick);
  }
  function handleOutsideClick(event) {
    if (!three_dot_list.contains(event.target)) {
      closeMenu();
    }
  }
  document.addEventListener("mousedown", handleOutsideClick);
}



// employee data showing on table body 
function employeeDisplay(data, TotalCountOnPage) {
  let temp = "";

  for (var i = 0; i < data.length; i++) {
    const employee = data[i];
    temp += `<tr id="selectNow">
      <td>#0${(CurrentPage - 1) * TotalCountOnPage + i + 1}</td>
      <td>
        <div class="employee_img">
          <img class="img_table" src="/${employee.image}">
          ${employee.salutation + " " + employee.firstName + " " + employee.lastName}
        </div>
      </td>
      <td>${employee.email}</td>
      <td>${employee.phone}</td>  
      <td>${employee.gender}</td>
      <td>${employee.dob}</td>
      <td class="col_section">${employee.country}</td>
      <td>
        <div class="menu_icon">
          <button class="three_dot_list" onclick="three_dot_list('${employee._id
      }')">
            <i class="fa-solid fa-ellipsis"></i>
          </button>
        </div>
      </td>
      <div class="employee_action_btn" id="employee_action_btn"></div>
    </tr>`;
  }
  document.getElementById("table_text").innerHTML = temp;
}



get_emp();
var isFetching = false;
var CurrentPage = 1;


// get employee
// read-employee..........start
function get_emp() {
  if (isFetching) {
    return;
  }
  isFetching = true;
  const employeeCountChange = document.getElementById("list_employee");
  const TotalCountOnPage = employeeCountChange.value;

  fetch(
    `https://employee-management-38fu.onrender.com/api/employees?page=${CurrentPage}&size=${TotalCountOnPage}`
  )
    .then((Response) => {
      return Response.json();
    })
    .then((data) => {
      isFetching = false;

      // --list-employee-length-----start
      employeeCountChange.addEventListener("change", get_emp);
      const total_employee = document.getElementById("total_employee");
      total_employee.innerHTML = `of ${data.Totalemployees.length}`;
      // --list-employee-length-----end

      const totalPages = Math.ceil(
        data.Totalemployees.length / TotalCountOnPage
      );
      pagination(totalPages);
      employeeDisplay(data.employees, TotalCountOnPage);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      isFetching = false;
    });
}



// ...pagination...............start
function pagination(totalPages) {
  var pgnum = document.getElementById("Page_Num_Btns");
  let temp = "";

  for (let i = 1; i <= totalPages; i++) {
    temp += `<button id="page${i}">${i}</button>`;
  }
  pgnum.innerHTML = temp;
  pgnum.addEventListener("click", function (e) {
    if (e.target.tagName === "BUTTON") {
      const pageNumber = parseInt(e.target.textContent);
      if (!isNaN(pageNumber)) {
        CurrentPage = pageNumber;
        get_emp();
      }
    }
  });

  var pageLeftButton = document.getElementById("pageleft");
  var pageRightButton = document.getElementById("pageright");

  if (CurrentPage === 1) {
    pageLeftButton.classList.add("hidden");
  } else {
    pageLeftButton.classList.remove("hidden");
  }

  if (CurrentPage === totalPages) {
    pageRightButton.classList.add("hidden");
  } else {
    pageRightButton.classList.remove("hidden");
  }

  pageLeftButton.addEventListener("click", function () {
    if (CurrentPage > 1) {
      CurrentPage--;
      get_emp();
    }
  });

  pageRightButton.addEventListener("click", function () {
    if (CurrentPage < totalPages) {
      CurrentPage++;
      get_emp();
    }
  });
  const actionButton = document.getElementById(`page${CurrentPage}`);
  actionButton.classList.add("active");
}


// -----add-employee--------------start
const addButton = document.getElementById("add_employee");
addButton.addEventListener("click", (e) => {
  e.preventDefault();

  const isValid = validateForm();
  if (!isValid) {
    return;
  }

  const salutation = document.getElementById("Salutation").value;
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("LastName").value;
  const email = document.getElementById("Email").value;
  const phone = document.getElementById("Phone").value;
  const dob = document.getElementById("dob").value;
  const gender = document.querySelector('input[name="gender"]:checked').value;
  const qualifications = document.getElementById("Qualifications").value;
  const address = document.getElementById("Address").value;
  const country = document.getElementById("country").value;
  const state = document.getElementById("State").value;
  const city = document.getElementById("City").value;
  const pin = document.getElementById("pin").value;
  const [year, month, date] = dob.split("-");
  const newDob = `${date}-${month}-${year}`;
  const Image = document.getElementById("upload_file").files[0];

  const formData = new FormData();

  formData.append("image", Image);
  formData.append("salutation", salutation);
  formData.append("firstName", firstName);
  formData.append("lastName", lastName);
  formData.append("email", email);
  formData.append("phone", phone);
  formData.append("dob", newDob);
  formData.append("gender", gender);
  formData.append("qualifications", qualifications);
  formData.append("address", address);
  formData.append("country", country);
  formData.append("state", state);
  formData.append("city", city);
  formData.append("pin", pin);
  formData.append("username", firstName);
  formData.append("password", phone);

  const apiUrl = "https://employee-management-38fu.onrender.com/api/employees";
  fetch(apiUrl, {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("API Response:", data);
      get_emp();
      showPopup();
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  get_emp();
  CurrentPage = 1;
});



// delete_employee_open_form
function open_delete_form(id) {
  var delete_form = document.getElementsByClassName("delete_btn_form")[0];
  delete_form.style.display = "block";
  var overlay = document.getElementsByClassName("overlay")[0];
  overlay.style.display = "block";

  const delebutton = document.getElementById("delete_btn_action");
  delebutton.addEventListener("click", () => {
    delete_employee(id);
  });
}


// ........delete-Employee...........start
function delete_employee(id) {
  fetch(`https://employee-management-38fu.onrender.com/api/employees/${id}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("API Response:", data);
      deleteshowPopup();
      get_emp();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  delete_close_btn();
}

// delete_employee_close_form
function delete_close_btn() {
  var close_btn = document.getElementsByClassName("delete_btn_form")[0];
  close_btn.style.display = "none";
  var overlay = document.getElementsByClassName("overlay")[0];
  overlay.style.display = "none";
}




// edit_button
function edit_btn(id) {
  // const imgView = document.getElementById("edit_img");
  // imgView.src = "";
  // const upload_file = document.getElementById("edit_upload_file");
  // upload_file.value = "";
  const edit_btn = document.getElementsByClassName("edit_employee")[0];
  const overlay = document.getElementsByClassName("overlay")[0];
  edit_btn.style.display = "block";
  overlay.style.display = "block";

  // .....edit_employee_data_insert.........start
  fetch(`https://employee-management-38fu.onrender.com/api/employees/${id}`)
    .then((Response) => {
      return Response.json();
    })
    .then((data) => {
      console.log(data);

      const edit_img = document.getElementById("edit_img");
      edit_img.src = `https://employee-management-38fu.onrender.com/api/employees/${id}`;
      document.getElementById("edit_img").src = data.image;
      document.getElementById("edit_Salutation").value = data.salutation;
      document.getElementById("edit_firstName").value = data.firstName;
      document.getElementById("edit_LastName").value = data.lastName;
      document.getElementById("edit_Email").value = data.email;
      document.getElementById("edit_Phone").value = data.phone;
      const dobValue = data.dob;
      const [day, month, year] = dobValue.split("-");
      const formattedDob = `${year}-${month}-${day}`;
      document.getElementById("edit_dob").value = formattedDob;
      document.querySelector(`input[name="edit_gender"][value ="${data.gender}"]`).checked = true;
      document.getElementById("edit_Qualifications").value =
        data.qualifications;
      document.getElementById("edit_Address").value = data.address;
      document.getElementById("edit_country").value = data.country;
      document.getElementById("edit_State").value = data.state;
      document.getElementById("edit_City").value = data.city;
      document.getElementById("edit_pin").value = data.pin;
      get_emp();
    })
    .catch((error) => {
      console.error("error:", error);
    });

  const editBtn = document.getElementById("savechange");
  editBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const isValid = editFormValidate();
    if (!isValid) {
      return;
    }
    editEmployee(id);
    edit_close_btn(event);
    get_emp();
  });
}


// edit_employee_close_btn
function edit_close_btn() {
  var close_btn = document.getElementsByClassName("edit_employee")[0];
  close_btn.style.display = "none";
  var overlay = document.getElementsByClassName("overlay")[0];
  overlay.style.display = "none";
  clearErrorMessages();
  get_emp();
}


// ....edit employee...............start
function editEmployee(id) {
  const salutation = document.getElementById("edit_Salutation").value;
  const firstName = document.getElementById("edit_firstName").value;
  const lastName = document.getElementById("edit_LastName").value;
  const email = document.getElementById("edit_Email").value;
  const phone = document.getElementById("edit_Phone").value;
  const dob = document.getElementById("edit_dob").value;
  const gender = document.querySelector('input[name="edit_gender"]:checked').value;
  const qualifications = document.getElementById("edit_Qualifications").value;
  const address = document.getElementById("edit_Address").value;
  const country = document.getElementById("edit_country").value;
  const state = document.getElementById("edit_State").value;
  const city = document.getElementById("edit_City").value;
  const pin = document.getElementById("edit_pin").value;
  const [year, month, date] = dob.split("-");
  const dobformatted = `${date}-${month}-${year}`;

  const formData = new FormData();
  const edit_upload_file = document.getElementById("edit_upload_file").files[0];
  if (edit_upload_file) {
    formData.append("image", edit_upload_file);
  }
  formData.append("salutation", salutation);
  formData.append("firstName", firstName);
  formData.append("lastName", lastName);
  formData.append("email", email);
  formData.append("phone", phone);
  formData.append("dob", dobformatted);
  formData.append("gender", gender);
  formData.append("qualifications", qualifications);
  formData.append("address", address);
  formData.append("country", country);
  formData.append("state", state);
  formData.append("city", city);
  formData.append("pin", pin);
  formData.append("username", firstName);
  formData.append("password", phone);

  console.log(formData);

  fetch(`https://employee-management-38fu.onrender.com/api/employees/${id}`, {
    method: "PUT",
    body: formData,
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log("API Response:", data);
      get_emp();
      EditedshowPopup();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}





// ......searchEmployeee.....start
function searchInput() {
  let searchKey = document.getElementById("searchInput").value;
  searchKey = searchKey.toLowerCase();
  const noEmployeeMessage = document.getElementById("noEmployeeMessage");

  if (searchKey) {
    fetch(`https://employee-management-38fu.onrender.com/api/employees/search/${searchKey}`)
      .then((response) => response.json())
      .then((data) => {
        employeeDisplay(data.employee, data.employee.length);
        if (data.employee.length === 0) {
          noEmployeeMessage.style.display = "block";
        }
        else {
          noEmployeeMessage.style.display = "none";
        }
      })
      .catch((error) => console.error("Error:", error));

  } else {
    get_emp();
    noEmployeeMessage.style.display = "none";
  }
}



// ...image-Post-view........start
const upload_file = document.getElementById("upload_file");
upload_file.addEventListener("change", uploadImage);

function uploadImage() {
  const imgLink = URL.createObjectURL(upload_file.files[0]);
  const imgView = document.getElementById("image");
  imgView.src = imgLink;
  const cardImg = document.getElementById("card-img");
  const hidden = document.getElementById("hidden");
  hidden.style.display = "none";
  cardImg.style.display = "flex";
  cardImg.style.justifyContent = "center";
  const border = document.getElementById("img-view");
  border.style.width = "200px";
  const imageError = (document.getElementById("imageError").style.display = "none");
}


// ---edit employee upload image-------start
let selectedImage = document.getElementById("edit_img");
let edit_upload_file = document.getElementById("edit_upload_file");
edit_upload_file.onchange = function () {
  selectedImage.src = URL.createObjectURL(edit_upload_file.files[0]);
  selectedImage.style.width = "110px";
  selectedImage.style.height = "110px";
};



// -------form-clear----------start
function clearForm() {
  const genderRadios = document.querySelectorAll('input[name="gender"]');
  genderRadios.forEach((radio) => {
    radio.checked = false;
  });
  const upload_file = document.getElementById("upload_file").form;
  upload_file.reset();

  const imgView = document.getElementById("image");
  imgView.src = "";
  // const upload_file =document.getElementById('upload_file');
  // upload_file.value="";
  const hidden = document.getElementById("hidden");
  hidden.style.display = "block";
  const cardImg = document.getElementById("card-img");
  cardImg.style.display = "block";
  const border = document.getElementById("img-view");
  border.style.width = "";
  const imageError = (document.getElementById("imageError").style.display = "block");
  get_emp();
}



// ........validateForm.............start
function validateForm() {
  const salutation = document.getElementById("Salutation").value.trim();
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("LastName").value.trim();
  const email = document.getElementById("Email").value.trim();
  const phone = document.getElementById("Phone").value.trim();
  const dobInput = document.getElementById("dob");
  const dobError = document.getElementById("dobError");
  const dobValue = dobInput.value.trim();

  const selectedGender = document.querySelector('input[name="gender"]:checked');
  const genderError = document.getElementById("genderError");

  const qualifications = document.getElementById("Qualifications").value.trim();
  const address = document.getElementById("Address").value.trim();
  const country = document.getElementById("country").value.trim();
  const state = document.getElementById("State").value.trim();
  const city = document.getElementById("City").value.trim();
  const pin = document.getElementById("pin").value.trim();

  // regex validation
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const phonePattern = /^\d{10}$/;
  const namePattern = /^[A-Za-z]+$/;

  let isValid = true;

  // image_validation-----------------
  const imageInput = document.getElementById("upload_file");
  const imageError = document.getElementById("imageError");
  if (imageInput.files.length === 0) {
    imageError.textContent = "Please select an image.";
    isValid = false;
  } else {
    imageError.textContent = "";
  }


  if (salutation === "select") {
    document.getElementById("SalutationError").textContent = "Invalid select";
    isValid = false;
  }

  if (!namePattern.test(firstName)) {
    document.getElementById("firstNameError").textContent = "First Name is required";
    isValid = false;
  }

  if (!namePattern.test(lastName)) {
    document.getElementById("LastNameError").textContent = "Last Name is required";
    isValid = false;
  }

  if (!emailPattern.test(email)) {
    document.getElementById("EmailError").textContent = "Invalid Email";
    isValid = false;
  }

  if (!phonePattern.test(phone)) {
    document.getElementById("PhoneError").textContent = "Invalid Phone Number";
    isValid = false;
  }

  if (dobValue === "") {
    dobError.textContent = "Date of Birth is required";
    isValid = false;
  }

  if (selectedGender) {
    genderError.textContent = "";
  } else {
    genderError.textContent = "Please select a gender";
    isValid = false;
  }

  if (qualifications === "") {
    document.getElementById("QualificationsError").textContent =
      "Qualifications is required";
    isValid = false;
  }

  if (address === "") {
    document.getElementById("AddressError").textContent = "Address is required";
    isValid = false;
  }

  if (country === "select country") {
    document.getElementById("countryError").textContent = "country is required";
    isValid = false;
  }

  if (state === "select state") {
    document.getElementById("StateError").textContent = "state is required";
    isValid = false;
  }

  if (city === "") {
    document.getElementById("CityError").textContent = "city is required";
    isValid = false;
  }

  if (pin === "") {
    document.getElementById("pinError").textContent = "pin is required";
    isValid = false;
  }

  document.getElementById("add_employee_form").addEventListener("input", (event) => {
    DataName = event.target.id;
    const errorId = `${DataName}Error`;

    document.getElementById(errorId).textContent = "";
  });

  return isValid;
}

const maleRadioButton = document.getElementById("male");
const femaleRadioButton = document.getElementById("female");
const genderError = document.getElementById("genderError");

maleRadioButton.addEventListener("click", () => {
  genderError.textContent = "";
});

femaleRadioButton.addEventListener("click", () => {
  genderError.textContent = "";
});


//--Clear the error messages ------------
function clearErrorMessages() {
  const errorElements = document.querySelectorAll(".error");
  errorElements.forEach(function (element) {
    element.textContent = "";
  });
}




// edit_form_validation
function editFormValidate() {
  const salutation = document.getElementById("edit_Salutation").value.trim();
  const firstName = document.getElementById("edit_firstName").value.trim();
  const lastName = document.getElementById("edit_LastName").value.trim();
  const email = document.getElementById("edit_Email").value.trim();
  const phone = document.getElementById("edit_Phone").value.trim();
  const dobInput = document.getElementById("edit_dob");
  const dobError = document.getElementById("edit_dobError");
  const dobValue = dobInput.value.trim();

  const selectedGender = document.querySelector('input[name="edit_gender"]:checked');
  const genderError = document.getElementById("edit_genderError");

  const qualifications = document.getElementById("edit_Qualifications").value.trim();
  const address = document.getElementById("edit_Address").value.trim();
  const country = document.getElementById("edit_country").value.trim();
  const state = document.getElementById("edit_State").value.trim();
  const city = document.getElementById("edit_City").value.trim();
  const pin = document.getElementById("edit_pin").value.trim();

  // regex validation
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const phonePattern = /^\d{10}$/;
  const namePattern = /^[A-Za-z]+$/;

  let isValid = true;


  if (salutation === "select") {
    document.getElementById("edit_SalutationError").textContent = "Invalid select";
    isValid = false;
  }

  if (!namePattern.test(firstName)) {
    document.getElementById("edit_firstNameError").textContent = "First Name is required";
    isValid = false;
  }

  if (!namePattern.test(lastName)) {
    document.getElementById("edit_LastNameError").textContent = "Last Name is required";
    isValid = false;
  }

  if (!emailPattern.test(email)) {
    document.getElementById("edit_EmailError").textContent = "Invalid Email";
    isValid = false;
  }

  if (!phonePattern.test(phone)) {
    document.getElementById("edit_PhoneError").textContent = "Invalid Phone Number";
    isValid = false;
  }

  if (dobValue === "") {
    dobError.textContent = "Date of Birth is required";
    isValid = false;
  }

  if (selectedGender) {
    genderError.textContent = "";
  } else {
    genderError.textContent = "Please select a gender";
    isValid = false;
  }

  if (qualifications === "") {
    document.getElementById("edit_QualificationsError").textContent =
      "Qualifications is required";
    isValid = false;
  }

  if (address === "") {
    document.getElementById("edit_AddressError").textContent = "Address is required";
    isValid = false;
  }

  if (country === "select country") {
    document.getElementById("edit_countryError").textContent = "country is required";
    isValid = false;
  }

  if (state === "select state") {
    document.getElementById("edit_StateError").textContent = "state is required";
    isValid = false;
  }

  if (city === "") {
    document.getElementById("edit_CityError").textContent = "city is required";
    isValid = false;
  }

  if (pin === "") {
    document.getElementById("edit_pinError").textContent = "pin is required";
    isValid = false;
  }

  document.getElementById("edit_employee_form").addEventListener("input", (event) => {
    DataName = event.target.id;
    const errorId = `${DataName}Error`;

    document.getElementById(errorId).textContent = "";
  });

  return isValid;
}

const editmaleRadioButton = document.getElementById("male");
const editfemaleRadioButton = document.getElementById("female");
const editgenderError = document.getElementById("edit_genderError");

editmaleRadioButton.addEventListener("click", () => {
  editgenderError.textContent = "";
});

editfemaleRadioButton.addEventListener("click", () => {
  editgenderError.textContent = "";
});


