import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Button, Alert, Table } from "react-bootstrap";
import LinkModal from "../components/LinkModal";

import {
  collection,
  query,
  deleteDoc,
  doc,
  onSnapshot,
  where,
} from "firebase/firestore";

import { useAuth } from "../context/AuthContext";

import { db } from "../firebase";

export default function UserDashboardPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { user, logout } = useAuth();
  const [quizes, setQuizes] = useState([]);
  const [link, setLink] = useState("");

  const handleClose = () => setLink("");
  const handleShow = (link) => setLink(link);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) {
        return;
      }
      const q = query(
        collection(db, "quizes"),
        where("userId", "==", user.uid)
      );
      onSnapshot(q, (querySnapshot) => {
        setQuizes(
          querySnapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
        );
      });
    };
    fetchData();
  }, [user?.uid]);

  const handleDelete = (id) => async () => {
    const taskDocRef = doc(db, "quizes", id);
    try {
      await deleteDoc(taskDocRef);
    } catch (err) {
      alert(err);
    }
  };

  const handleLogout = async () => {
    setError("");

    try {
      await logout();
      navigate("/login");
    } catch {
      setError("Failed to log out");
    }
  };

  const getLinkUrl = (linkCode) => {
    return `${window.location.href}start-quiz/${linkCode}`;
  };

  return (
    <div>
      <div className="w-100 text-center mt-2">
        <Button variant="link" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <strong>Email:</strong> {user.email}
          <Link to="/create-quiz" className="btn btn-primary w-100 mt-3">
            Create new Quiz
          </Link>
        </Card.Body>
      </Card>
      <br />
      <Card>
        <Card.Body>
          <h3 className="text-center mb-4">Your Quizes</h3>
          {!quizes?.length ? (
            <Alert variant="info">You don't have any quiz!</Alert>
          ) : (
            <Table>
              <tbody style={{ margin: "0 auto" }}>
                {quizes?.map((quiz) => (
                  <tr
                    key={quiz.id}
                    style={{
                      borderTop: "1px solid #dee2e6",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <td>
                      <strong>{quiz.title}</strong>
                    </td>
                    <td>
                      <Button
                        variant="outline-primary"
                        onClick={() => handleShow(quiz.linkCode)}
                      >
                        Share
                      </Button>
                      <Button
                        className="mr-2 ml-2"
                        variant="outline-secondary"
                        onClick={() =>
                          window
                            .open(`/start-quiz/${quiz.linkCode}`, "_blank")
                            .focus()
                        }
                      >
                        Open
                      </Button>
                      <Button
                        variant="outline-danger"
                        onClick={handleDelete(quiz.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
      <LinkModal
        link={link}
        handleClose={handleClose}
        getLinkUrl={getLinkUrl}
      />
    </div>
  );
}
