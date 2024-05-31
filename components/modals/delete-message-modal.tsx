"use client";
import qs from "query-string";
import axios from "axios";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Button } from "@/components/ui/button";

const DeleteMessageModal = () => {
  const { isOpen, onClose, type, data } = useModal();

  const [isLoaded, setIsLoaded] = useState(false);

  const isModalOpen = isOpen && type === "deleteMessage";
  const { apiUrl, query } = data;

  const onClick = async () => {
    try {
      setIsLoaded(true);
      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query,
      });

      await axios.delete(url);

      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoaded(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            Delete Message
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-center text-zinc-500">
          Are you sure you want to do this? <br />
          The message will be permanently deleted.
        </DialogDescription>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex w-full items-center justify-between">
            <Button disabled={isLoaded} variant="ghost" onClick={onClose}>
              Cancel
            </Button>

            <Button disabled={isLoaded} variant="primary" onClick={onClick}>
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteMessageModal;
