"use client";

import { useSavedPageState } from './useSavedPageState';
import { CreateFolderModal, RenameFolderModal, DeleteFolderModal } from './FolderModals';
import { MoveToCollectionModal } from './MoveToCollectionModal';

export function SavedModals({state}: {state: ReturnType<typeof useSavedPageState>}) {
const { entries, showCreateFolder, setShowCreateFolder, renameTarget, setRenameTarget, deleteTarget, setDeleteTarget, moveTarget, setMoveTarget, collections, collectionNames, handleCreateFolder, handleRenameFolder, handleDeleteFolder, handleMoveToCollection, handleEnsureCollectionExists } = state;
return <>
      {showCreateFolder && (
        <CreateFolderModal
          existing={collectionNames}
          onConfirm={handleCreateFolder}
          onClose={() => setShowCreateFolder(false)}
        />
      )}

      {renameTarget && (
        <RenameFolderModal
          current={renameTarget}
          existing={collectionNames.filter((n) => n !== renameTarget)}
          onConfirm={(newName) => { void handleRenameFolder(renameTarget, newName) }}
          onClose={() => setRenameTarget(null)}
        />
      )}

      {deleteTarget && (
        <DeleteFolderModal
          name={deleteTarget}
          count={collections.find((c) => c.name === deleteTarget)?.cafes.length ?? 0}
          onConfirm={() => { void handleDeleteFolder(deleteTarget) }}
          onClose={() => setDeleteTarget(null)}
        />
      )}

      {moveTarget && (
        <MoveToCollectionModal
          cafe={moveTarget}
          collections={collections}
          currentCollection={entries.find((e) => e.cafe.id === moveTarget.id)?.collectionName ?? null}
          onMove={(col) => handleMoveToCollection(moveTarget, col)}
          onCreate={handleEnsureCollectionExists}
          onClose={() => setMoveTarget(null)}
        />
      )}

</>;
}
