import { useTranslation } from 'react-i18next';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import styles from '@/pages/MonitorPage.module.scss';

export type CleanupMode = 'polling_failed' | 'all_failed';

interface CleanupFailedRequestsModalProps {
  open: boolean;
  mode: CleanupMode;
  loading: boolean;
  failedCount: number;
  pollingCandidateCount: number;
  affectedGroups: number;
  summaryItems: string[];
  onModeChange: (mode: CleanupMode) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function CleanupFailedRequestsModal({
  open,
  mode,
  loading,
  failedCount,
  pollingCandidateCount,
  affectedGroups,
  summaryItems,
  onModeChange,
  onConfirm,
  onCancel,
}: CleanupFailedRequestsModalProps) {
  const { t } = useTranslation();

  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={t('monitor.logs.cleanup_confirm_title')}
      width={560}
      closeDisabled={loading}
    >
      <div className={styles.cleanupModalBody}>
        <p className={styles.cleanupDescription}>{t('monitor.logs.cleanup_confirm_desc')}</p>

        <div className={styles.cleanupSummary}>
          <div className={styles.cleanupStat}>
            <span className={styles.cleanupStatLabel}>{t('monitor.logs.cleanup_failed_scope_count')}</span>
            <strong>{failedCount.toLocaleString()}</strong>
          </div>
          <div className={styles.cleanupStat}>
            <span className={styles.cleanupStatLabel}>{t('monitor.logs.cleanup_polling_scope_count')}</span>
            <strong>{pollingCandidateCount.toLocaleString()}</strong>
          </div>
          <div className={styles.cleanupStat}>
            <span className={styles.cleanupStatLabel}>{t('monitor.logs.cleanup_polling_group_count')}</span>
            <strong>{affectedGroups.toLocaleString()}</strong>
          </div>
        </div>

        <div className={styles.cleanupModeList} role="radiogroup" aria-label={t('monitor.logs.cleanup_button')}>
          <label className={styles.cleanupModeItem}>
            <input
              type="radio"
              name="cleanup-mode"
              checked={mode === 'polling_failed'}
              onChange={() => onModeChange('polling_failed')}
              disabled={loading}
            />
            <div>
              <div className={styles.cleanupModeTitle}>{t('monitor.logs.cleanup_mode_polling')}</div>
              <div className={styles.cleanupModeHint}>{t('monitor.logs.cleanup_mode_polling_hint')}</div>
            </div>
          </label>

          <label className={styles.cleanupModeItem}>
            <input
              type="radio"
              name="cleanup-mode"
              checked={mode === 'all_failed'}
              onChange={() => onModeChange('all_failed')}
              disabled={loading}
            />
            <div>
              <div className={styles.cleanupModeTitle}>{t('monitor.logs.cleanup_mode_all')}</div>
              <div className={styles.cleanupModeHint}>{t('monitor.logs.cleanup_mode_all_hint')}</div>
            </div>
          </label>
        </div>

        <div className={styles.cleanupScope}>
          <div className={styles.cleanupScopeTitle}>{t('monitor.logs.cleanup_scope_title')}</div>
          <ul className={styles.cleanupScopeList}>
            {summaryItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className={styles.cleanupActions}>
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            {t('common.cancel')}
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>
            {t('monitor.logs.cleanup_confirm_action')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
