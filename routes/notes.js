const express = require("express");
const Note = require("../models/note");
const router = express.Router();

router.get("/new", (req, res) => {
  res.render("notes/new", { note: new Note() });
});

router.get("/edit/:id", async (req, res) => {
  const note = await Note.findById(req.params.id);
  res.render("notes/edit", { note: note });
});

router.get("/:slug", async (req, res) => {
  const note = await Note.findOne({ slug: req.params.slug });
  if (note == null) res.redirect("/");
  res.render("notes/show", { note: note });
});

router.post(
  "/",
  async (req, res, next) => {
    req.note = new Note();
    next();
  },
  saveNoteAndRedirect("new")
);

router.put(
  "/:id",
  async (req, res, next) => {
    req.note = await Note.findById(req.params.id);
    next();
  },
  saveNoteAndRedirect("edit")
);

router.delete("/:id", async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

function saveNoteAndRedirect(path) {
  return async (req, res) => {
    let note = req.note;
    note.title = req.body.title;
    note.description = req.body.description;
    note.markdown = req.body.markdown;
    try {
      note = await note.save();
      res.redirect(`/notes/${note.slug}`);
    } catch (e) {
      res.render(`notes/${path}`, { note: note });
    }
  };
}

module.exports = router;
