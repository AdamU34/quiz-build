import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { CopyToClipboard } from "react-copy-to-clipboard";

function LinkModal({ link = "", handleClose, getLinkUrl }) {
  const [copied, setCopied] = useState(false);

  const closeModal = () => {
    handleClose();
    setCopied(false);
  };

  const handleOpenQuizClick = () => {
    handleClose();
    setCopied(false);
    window.open(`/start-quiz/${link}`, "_blank").focus();
  };

  return (
    <>
      <Modal show={link ? true : false} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Copy the quiz link</Modal.Title>
        </Modal.Header>
        <Modal.Body>{getLinkUrl(link)}</Modal.Body>
        <Modal.Footer>
          <CopyToClipboard
            text={getLinkUrl(link)}
            onCopy={() => setCopied(true)}
          >
            <Button disabled={copied} variant="primary">
              {copied ? "Copied" : "Copy"}
            </Button>
          </CopyToClipboard>
          <Button variant="secondary" onClick={handleOpenQuizClick}>
            Open quiz
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default LinkModal;
