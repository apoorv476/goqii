<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");


//include "db.php";
include "db.php";

$action = $_GET['action'] ?? '';

if ($action == "create") {

    $data = json_decode(file_get_contents("php://input"), true);

    $name = $data['name'] ?? '';
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';
    $dob = $data['dob'] ?? '';

    if (empty($name) || empty($email) || empty($password) || empty($dob)) {
        echo json_encode(["success" => false, "message" => "All fields are required."]);
        exit;
    }

    // Use prepared statements to prevent SQL injection
    $stmt = $conn->prepare("INSERT INTO users (name, email, password, dob) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $name, $email, $password, $dob);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "User created successfully."]);
    } else {
        echo json_encode(["success" => false, "message" => "Error: " . $stmt->error]);
    }
    $stmt->close();
} elseif ($action == "read") {

    $sql = "SELECT * FROM users ORDER BY id DESC";
    $result = mysqli_query($conn, $sql);
    $users = [];

    while ($row = mysqli_fetch_assoc($result)) {
        $users[] = $row;
    }

    echo json_encode($users);
} elseif ($action == "update") {

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {

        $data = json_decode(file_get_contents("php://input"), true);

        $name = $data['name'] ?? '';
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';
        $dob = $data['dob'] ?? '';
        $id = $data['id'] ?? '';
        if (empty($id) || empty($name) || empty($email) || empty($password) || empty($dob)) {
            echo json_encode(["success" => false, "message" => "All fields are required."]);
            exit;
        }

        $stmt = $conn->prepare("UPDATE users SET name=?, email=?, password=?, dob=? WHERE id=?");
        $stmt->bind_param("ssssi", $name, $email, $password, $dob, $id);

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "User updated successfully."]);
        } else {
            echo json_encode(["success" => false, "message" => "Error: " . $stmt->error]);
        }
        $stmt->close();
    }
} elseif ($action == "delete") {

    $id = $_GET['id'] ?? '';
    $stmt = $conn->prepare("DELETE FROM users WHERE id=?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "User deleted successfully."]);
    } else {
        echo json_encode(["success" => false, "message" => "Error: " . $stmt->error]);
    }
    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Invalid action."]);
}

$conn->close();
