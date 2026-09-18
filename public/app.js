const studentForm = document.getElementById("student-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneNumberInput = document.getElementById("phone-number");
const studentList = document.getElementById("student-list");
const formTitle = document.getElementById("form-title");
const submitButton = document.getElementById("submit-button");
const cancelButton = document.getElementById("cancel-button");
const courseForm = document.getElementById("course-form");
const courseCodeInput = document.getElementById("course-code");
const courseNameInput = document.getElementById("course-name");
const maximumStudentsInput = document.getElementById("maximum-students");
const courseList = document.getElementById("course-list");
const courseFormTitle = document.getElementById("course-form-title");
const courseSubmitButton = document.getElementById("course-submit-button");
const courseCancelButton = document.getElementById("course-cancel-button");

let editingStudentId = "";
let students = [];
let editingCourseId = "";
let courses = [];

function showSuccess(message) {
  Swal.fire({ icon: "success", title: "Success", text: message });
}

function showError(message) {
  Swal.fire({ icon: "error", title: "Error", text: message });
}

async function readResponse(response) {
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

function showSection(sectionId) {
  document.querySelectorAll("main section").forEach((section) => {
    section.hidden = section.id !== sectionId;
  });
}

document.querySelectorAll("[data-section]").forEach((button) => {
  button.addEventListener("click", () => showSection(button.dataset.section));
});

async function loadStudents() {
  try {
    const response = await fetch("/students");
    const data = await readResponse(response);

    if (!response.ok) {
      throw new Error(data.message || "Could not load students");
    }

    students = data;
    renderStudents();
  } catch (error) {
    showError(error instanceof Error ? error.message : "Could not load students");
  }
}

function addCell(row, value) {
  const cell = document.createElement("td");
  cell.textContent = value;
  row.appendChild(cell);
}

function createActionButton(text, action, id) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = text;
  button.dataset.action = action;
  button.dataset.id = id;
  return button;
}

function renderStudents() {
  studentList.innerHTML = "";

  for (let index = 0; index < students.length; index += 1) {
    const student = students[index];
    const row = document.createElement("tr");

    addCell(row, String(index + 1));
    addCell(row, String(student.rollNumber));
    addCell(row, student.name);
    addCell(row, student.email);
    addCell(row, student.phoneNumber);

    const actionCell = document.createElement("td");
    actionCell.appendChild(createActionButton("Edit", "edit", student._id));
    actionCell.appendChild(createActionButton("Delete", "delete", student._id));
    actionCell.appendChild(createActionButton("Courses", "courses", student._id));
    row.appendChild(actionCell);

    studentList.appendChild(row);
  }
}

function startEdit(id) {
  const student = students.find((item) => item._id === id);

  if (!student) {
    showError("Student was not found");
    return;
  }

  editingStudentId = id;
  nameInput.value = student.name;
  emailInput.value = student.email;
  phoneNumberInput.value = student.phoneNumber;
  formTitle.textContent = "Edit Student";
  submitButton.textContent = "Update Student";
  cancelButton.hidden = false;
}

function stopEdit() {
  editingStudentId = "";
  studentForm.reset();
  formTitle.textContent = "Add Student";
  submitButton.textContent = "Add Student";
  cancelButton.hidden = true;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function getData(url, errorMessage) {
  const response = await fetch(url);
  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(data?.message || errorMessage);
  }

  return data;
}

function getEnrollmentErrorMessage(data, fallbackMessage, courseTitle) {
  const message = data?.message || fallbackMessage;

  if (message === "Course has reached its maximum student capacity") {
    return `${courseTitle} has reached its maximum student capacity.`;
  }

  return message;
}

async function openStudentCourses(id) {
  const student = students.find((item) => item._id === id);

  if (!student) {
    showError("Student was not found");
    return;
  }

  try {
    const [availableCourses, enrollments] = await Promise.all([
      getData("/courses", "Could not load courses"),
      getData(`/enrollments/student/${id}`, "Could not load enrollments"),
    ]);
    const enrolledCourseIds = new Set(
      enrollments.map((enrollment) => String(enrollment.courseId)),
    );
    const courseChoices = availableCourses.length
      ? availableCourses
          .map(
            (course) => `
              <label class="course-choice">
                <input
                  type="checkbox"
                  data-course-id="${course._id}"
                  ${enrolledCourseIds.has(course._id) ? "checked" : ""}
                />
                ${escapeHtml(course.code)} — ${escapeHtml(course.title)}
              </label>`,
          )
          .join("")
      : "<p>No courses have been created yet.</p>";

    const result = await Swal.fire({
      title: "Student Courses",
      html: `
        <div class="student-details">
          <p><strong>Roll Number:</strong> ${escapeHtml(student.rollNumber)}</p>
          <p><strong>Name:</strong> ${escapeHtml(student.name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(student.email)}</p>
        </div>
        <div class="course-choices">
          <h3>Courses</h3>
          ${courseChoices}
        </div>`,
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      preConfirm: async () => {
        const selectedCourseIds = [...Swal.getPopup().querySelectorAll(
          "input[data-course-id]:checked",
        )].map((input) => input.dataset.courseId);
        const selectedCourseIdSet = new Set(selectedCourseIds);
        const enrollmentsToCreate = selectedCourseIds.filter(
          (courseId) => !enrolledCourseIds.has(courseId),
        );
        const enrollmentsToDelete = enrollments.filter(
          (enrollment) => !selectedCourseIdSet.has(String(enrollment.courseId)),
        );

        try {
          if (enrollmentsToCreate.length > 0) {
            const response = await fetch("/enrollments", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                studentId: id,
                courseIds: enrollmentsToCreate,
              }),
            });
            const data = await readResponse(response);

            if (!response.ok) {
              throw new Error(data?.message || "Could not create enrollments");
            }
          }

          for (const enrollment of enrollmentsToDelete) {
            const response = await fetch(`/enrollments/${enrollment._id}`, {
              method: "DELETE",
            });
            const data = await readResponse(response);

            if (!response.ok) {
              throw new Error(data?.message || "Could not remove enrollment");
            }
          }
        } catch (error) {
          Swal.showValidationMessage(
            error instanceof Error ? error.message : "Could not save courses",
          );
          return false;
        }

        return true;
      },
    });

    if (result.isConfirmed) {
      await loadCourses();
      showSuccess("Student courses updated");
    }
  } catch (error) {
    showError(error instanceof Error ? error.message : "Could not load courses");
  }
}

studentForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const studentData = {
    name: nameInput.value,
    email: emailInput.value,
    phoneNumber: phoneNumberInput.value,
  };

  try {
    let response;

    if (editingStudentId) {
      response = await fetch(`/students/${editingStudentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData),
      });
    } else {
      response = await fetch("/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData),
      });
    }

    const data = await readResponse(response);

    if (!response.ok) {
      throw new Error(data.message || "Could not save student");
    }

    const successMessage = editingStudentId
      ? "Student updated"
      : "Student created";
    stopEdit();
    await loadStudents();
    showSuccess(successMessage);
  } catch (error) {
    showError(error instanceof Error ? error.message : "Could not save student");
  }
});

studentList.addEventListener("click", async (event) => {
  const button = event.target.closest("button");

  if (!button) {
    return;
  }

  const id = button.dataset.id;

  if (!id) {
    return;
  }

  if (button.dataset.action === "edit") {
    startEdit(id);
    return;
  }

  if (button.dataset.action === "courses") {
    await openStudentCourses(id);
    return;
  }

  if (button.dataset.action === "delete") {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete student?",
      text: "This action cannot be undone.",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const response = await fetch(`/students/${id}`, { method: "DELETE" });
      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(data?.message || "Could not delete student");
      }

      if (editingStudentId === id) {
        stopEdit();
      }

      await loadStudents();
      showSuccess("Student deleted");
    } catch (error) {
      showError(
        error instanceof Error ? error.message : "Could not delete student",
      );
    }
  }
});

cancelButton.addEventListener("click", stopEdit);

function renderCourses() {
  courseList.innerHTML = "";

  for (let index = 0; index < courses.length; index += 1) {
    const course = courses[index];
    const row = document.createElement("tr");
    addCell(row, String(index + 1));
    addCell(row, course.code);
    addCell(row, course.title);
    addCell(
      row,
      `${course.currentStudents} / ${course.maximumStudents}`,
    );
    addCell(row, String(course.maximumStudents));

    const actionCell = document.createElement("td");
    actionCell.appendChild(createActionButton("Edit", "edit", course._id));
    actionCell.appendChild(createActionButton("Delete", "delete", course._id));
    actionCell.appendChild(createActionButton("Students", "students", course._id));
    row.appendChild(actionCell);
    courseList.appendChild(row);
  }
}

async function loadCourses() {
  try {
    const response = await fetch("/courses");
    const data = await readResponse(response);

    if (!response.ok) {
      throw new Error(data.message || "Could not load courses");
    }

    courses = await Promise.all(
      data.map(async (course) => {
        const enrollments = await getData(
          `/enrollments/course/${course._id}`,
          "Could not load enrollments",
        );

        return { ...course, currentStudents: enrollments.length };
      }),
    );
    renderCourses();
  } catch (error) {
    showError(error instanceof Error ? error.message : "Could not load courses");
  }
}

async function openCourseStudents(id) {
  const course = courses.find((item) => item._id === id);

  if (!course) {
    showError("Course was not found");
    return;
  }

  try {
    const [availableStudents, enrollments] = await Promise.all([
      getData("/students", "Could not load students"),
      getData(`/enrollments/course/${id}`, "Could not load enrollments"),
    ]);
    const enrolledStudentIds = new Set(
      enrollments.map((enrollment) => String(enrollment.studentId)),
    );
    const studentRows = availableStudents.length
      ? availableStudents
          .map(
            (student, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${escapeHtml(student.rollNumber)}</td>
                <td>${escapeHtml(student.name)}</td>
                <td>
                  <input
                    type="checkbox"
                    data-student-id="${student._id}"
                    ${enrolledStudentIds.has(student._id) ? "checked" : ""}
                  />
                </td>
              </tr>`,
          )
          .join("")
      : '<tr><td colspan="4">No students have been created yet.</td></tr>';

    const result = await Swal.fire({
      title: "Course Students",
      html: `
        <div class="course-details">
          <p><strong>Course Code:</strong> ${escapeHtml(course.code)}</p>
          <p><strong>Course Name:</strong> ${escapeHtml(course.title)}</p>
        </div>
        <div class="student-enrollment-table">
          <table>
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Roll Number</th>
                <th>Name</th>
                <th>Enrolled</th>
              </tr>
            </thead>
            <tbody>${studentRows}</tbody>
          </table>
        </div>`,
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      preConfirm: async () => {
        const selectedStudentIds = [...Swal.getPopup().querySelectorAll(
          "input[data-student-id]:checked",
        )].map((input) => input.dataset.studentId);
        const selectedStudentIdSet = new Set(selectedStudentIds);
        const enrollmentsToCreate = selectedStudentIds.filter(
          (studentId) => !enrolledStudentIds.has(studentId),
        );
        const enrollmentsToDelete = enrollments.filter(
          (enrollment) =>
            !selectedStudentIdSet.has(String(enrollment.studentId)),
        );

        try {
          for (const studentId of enrollmentsToCreate) {
            const response = await fetch("/enrollments", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ studentId, courseId: id }),
            });
            const data = await readResponse(response);

            if (!response.ok) {
              throw new Error(
                getEnrollmentErrorMessage(
                  data,
                  "Could not create enrollment",
                  course.title,
                ),
              );
            }
          }

          for (const enrollment of enrollmentsToDelete) {
            const response = await fetch(`/enrollments/${enrollment._id}`, {
              method: "DELETE",
            });
            const data = await readResponse(response);

            if (!response.ok) {
              throw new Error(data?.message || "Could not remove enrollment");
            }
          }
        } catch (error) {
          Swal.showValidationMessage(
            error instanceof Error
              ? error.message
              : "Could not save student enrollments",
          );
          return false;
        }

        return true;
      },
    });

    if (result.isConfirmed) {
      await loadCourses();
      showSuccess("Student enrollments updated successfully.");
    }
  } catch (error) {
    showError(
      error instanceof Error ? error.message : "Could not load students",
    );
  }
}

function startCourseEdit(id) {
  const course = courses.find((item) => item._id === id);

  if (!course) {
    showError("Course was not found");
    return;
  }

  editingCourseId = id;
  courseCodeInput.value = course.code;
  courseNameInput.value = course.title;
  maximumStudentsInput.value = course.maximumStudents;
  courseFormTitle.textContent = "Edit Course";
  courseSubmitButton.textContent = "Update Course";
  courseCancelButton.hidden = false;
}

function stopCourseEdit() {
  editingCourseId = "";
  courseForm.reset();
  courseFormTitle.textContent = "Add Course";
  courseSubmitButton.textContent = "Add Course";
  courseCancelButton.hidden = true;
}

courseForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const courseData = {
    code: courseCodeInput.value,
    title: courseNameInput.value,
    maximumStudents: Number(maximumStudentsInput.value),
  };

  try {
    const response = await fetch(
      editingCourseId ? `/courses/${editingCourseId}` : "/courses",
      {
        method: editingCourseId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseData),
      },
    );
    const data = await readResponse(response);

    if (!response.ok) {
      throw new Error(data.message || "Could not save course");
    }

    const successMessage = editingCourseId ? "Course updated" : "Course created";
    stopCourseEdit();
    await loadCourses();
    showSuccess(successMessage);
  } catch (error) {
    showError(error instanceof Error ? error.message : "Could not save course");
  }
});

courseList.addEventListener("click", async (event) => {
  const button = event.target.closest("button");

  if (!button || !button.dataset.id) {
    return;
  }

  const id = button.dataset.id;

  if (button.dataset.action === "edit") {
    startCourseEdit(id);
    return;
  }

  if (button.dataset.action === "students") {
    await openCourseStudents(id);
    return;
  }

  if (button.dataset.action === "delete") {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete course?",
      text: "This action cannot be undone.",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const response = await fetch(`/courses/${id}`, { method: "DELETE" });
      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(data?.message || "Could not delete course");
      }

      if (editingCourseId === id) {
        stopCourseEdit();
      }

      await loadCourses();
      showSuccess("Course deleted");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Could not delete course");
    }
  }
});

courseCancelButton.addEventListener("click", stopCourseEdit);

loadStudents();
loadCourses();
