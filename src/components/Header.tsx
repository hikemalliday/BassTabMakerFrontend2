import "../assets/Modals.css";
import "../assets/Header.css";
import { useState, useEffect } from "react";
import { OptionsModal } from "./OptionsModal";
import { useSongContext } from "../Context/SongContext";
import { useRefreshSong, useSaveSong, useUserNameQuery } from "../requests";
import { NewSongModal } from "./NewSongModal";
import { SongNamesModal } from "./SongNamesModal";
import DeleteSongModal from "./DeleteSongModal";
import { unReduceSong } from "../utils";
import { useSnackbarContext } from "../Context/SnackBarContext";
import { useLocalStorageContext } from "../Context/LocalStorageContext";
import { Tooltip } from "@mui/material";

export const Header = () => {
  const {
    songNameInt,
    setSongState,
    songState,
    songName,
    songNames,
    setSongName,
  } = useSongContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewSongOpen, setIsNewSongOpen] = useState(false);
  const [isSongNamesModalOpen, setIsSongNamesModalOpen] = useState(false);
  const [isDeleteSongModalOpen, setIsDeleteSongModalOpen] = useState(false);
  const { addToast } = useSnackbarContext();
  const { mutate: mutateSong } = useSaveSong();
  const { refreshSong } = useRefreshSong();
  const { clearSongContext } = useSongContext();
  const { userId, clearLocalStorageContext } = useLocalStorageContext();
  const { data } = useUserNameQuery(userId as number);

  const handleSave = (): void => {
    mutateSong(unReduceSong(songState, songNameInt));
    addToast(`Song: ${songName} saved.`, "success");
  };

  const handleRefresh = async () => {
    try {
      await refreshSong(songNameInt, songState, setSongState);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    clearSongContext();
    clearLocalStorageContext();
  };

  // Set song name string whenever int changes
  useEffect(() => {
    Object.entries(songNames).map(([songNameKey, pk]) => {
      if (pk === songNameInt) setSongName(songNameKey);
    });
  }, [songNameInt]);

  const isSongNamesEmpty = Object.keys(songNames).length === 0;

  return (
    <div className="header-container">
      <div className="header-icons">
        <Tooltip title="edit song">
          <i
            onClick={songNameInt !== 0 ? () => setIsModalOpen(true) : () => {}}
            className="fa-solid fa-gear"
          ></i>
        </Tooltip>
        <Tooltip title="select song">
          <i
            onClick={
              !isSongNamesEmpty ? () => setIsSongNamesModalOpen(true) : () => {}
            }
            className="fa-solid fa-music"
          ></i>
        </Tooltip>
        <Tooltip title="new song">
          <i
            onClick={() => setIsNewSongOpen(true)}
            className="fa-solid fa-plus"
          ></i>
        </Tooltip>
        <Tooltip title="delete song">
          <i
            className="fa-solid fa-trash header"
            onClick={
              songNameInt !== 0
                ? () => setIsDeleteSongModalOpen(true)
                : () => {}
            }
          ></i>
        </Tooltip>
        <Tooltip title="reset changes">
          <i onClick={handleRefresh} className="fa fa-refresh"></i>
        </Tooltip>
        <Tooltip title="save song">
          <i onClick={handleSave} className="far fa-save save-song"></i>
        </Tooltip>
      </div>
      <div className="logout-and-username">
        <div className="logout-button" onClick={handleLogout}>
          LOGOUT
        </div>
        <div className="username">{data ? `user: ${data.username}` : ""}</div>
      </div>

      {<OptionsModal open={isModalOpen} setOpen={setIsModalOpen} />}
      {<NewSongModal open={isNewSongOpen} setOpen={setIsNewSongOpen} />}
      {
        <SongNamesModal
          open={isSongNamesModalOpen}
          setOpen={setIsSongNamesModalOpen}
        />
      }
      {
        <DeleteSongModal
          open={isDeleteSongModalOpen}
          setOpen={setIsDeleteSongModalOpen}
        />
      }
    </div>
  );
};
