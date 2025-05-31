for %%f in (*.jpg) do (
  magick convert "%%f" -resize 1200x -quality 80 "%%~nf.webp"
)