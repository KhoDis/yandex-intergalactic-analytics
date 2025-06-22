import styles from "./HistoryPage.module.css";
import { History } from "./History.tsx";
import { Button } from "../../components/Button/Button.tsx";
import { useHistoryStore } from "../../stores/useHistoryStore.ts";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import type { RawHighlight } from "../../types/types.tsx";
import { Modal } from "../../components/Modal/Modal.tsx";
import { HighlightListModal } from "../../components/HighlightListModal/HighlightListModal.tsx";

const HistoryButtons = () => {
  const navigate = useNavigate();
  const clearHistory = useHistoryStore((state) => state.clearHistory);

  const handleGenerateMore = () => {
    navigate("/generate");
  };

  const handleClearAll = () => {
    clearHistory();
  };

  return (
    <div className={styles.buttons}>
      <Button type={"submit"} onClick={handleGenerateMore}>
        Сгенерировать больше
      </Button>
      <Button type={"clear"} onClick={handleClearAll}>
        Очистить всё
      </Button>
    </div>
  );
};

export const HistoryPage = () => {
  const {
    history,
    selectedHighlight,
    isModalOpen,
    loadHistory,
    removeHistoryItem,
    openModal,
    closeModal,
  } = useHistoryStore();

  // We need to load it on mount
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleItemClick = (highlight: RawHighlight) => {
    openModal(highlight);
  };

  const handleItemRemove = (id: string) => {
    removeHistoryItem(id);
  };

  return (
    <div className={styles.container}>
      <History
        history={history}
        onItemClick={handleItemClick}
        onItemRemove={handleItemRemove}
      />
      <HistoryButtons />

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <HighlightListModal highlight={selectedHighlight} />
      </Modal>
    </div>
  );
};
