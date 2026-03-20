import { useEffect, useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { getModerationQueue } from '../../services/reportService';
import { updateModerationQueueItem } from '../../services/moderationService';
import { formatDate } from '../../lib/formatters/dates';

export function ModerationQueuePage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getModerationQueue().then(setItems);
  }, []);

  async function resolveItem(itemId) {
    await updateModerationQueueItem(itemId, { status: 'resolved', actionTaken: 'Reviewed in client moderation queue' });
    const refreshed = await getModerationQueue();
    setItems(refreshed);
  }

  return (
    <PageContainer>
      <SectionHeader
        eyebrow="Moderation"
        title="Moderation queue"
        description="Client-side staff tools are intentionally limited. This page is a structured first pass and should later be backed by stronger role enforcement and audited admin actions."
      />
      <div className="conversation-list">
        {items.length ? (
          items.map((item) => (
            <Card key={item.id} className="conversation-list__item">
              <strong>{item.targetType}</strong>
              <p>Target ID: {item.targetId}</p>
              <small>{formatDate(item.createdAt)} · Status: {item.status}</small>
              {item.status !== 'resolved' ? <Button variant="secondary" onClick={() => resolveItem(item.id)}>Mark resolved</Button> : null}
            </Card>
          ))
        ) : (
          <Card>
            <h3>No moderation items yet</h3>
            <p>Reports submitted by users will create moderation queue records here.</p>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}
