import styles from "./HistoryPage.module.css";
import { History } from "../../components/history/History/History.tsx";
import { Button } from "../../components/common/Button/Button.tsx";
import {
  type HistoryEntry,
  useHistoryStore,
} from "../../stores/useHistoryStore.ts";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { Modal } from "../../components/history/Modal/Modal.tsx";
import { HighlightListModal } from "../../components/history/HighlightListModal/HighlightListModal.tsx";

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
    selectedHistoryEntry,
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

  const handleItemClick = (historyEntry: HistoryEntry) => {
    openModal(historyEntry);
  };

  const handleItemRemove = (id: string) => {
    removeHistoryItem(id);
  };

  return (
    <div className={styles.container} data-testid="history-page">
      <History
        history={history}
        onItemClick={handleItemClick}
        onItemRemove={handleItemRemove}
      />
      <HistoryButtons />

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <HighlightListModal historyEntry={selectedHistoryEntry} />
      </Modal>
    </div>
  );
};
