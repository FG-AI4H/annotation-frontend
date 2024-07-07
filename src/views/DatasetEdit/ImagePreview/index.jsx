import {
  Box,
  CircularProgress,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from '@mui/material';

export default function ImagePreview({ images, onClickImage, isLoading }) {
  return isLoading ? (
    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
      <CircularProgress />
    </Box>
  ) : (
    <ImageList gap={10} cols={3}>
      {images?.map((item) => (
        <>
          <ImageListItem key={item.photoKey} sx={{ cursor: 'pointer' }}>
            <img
              src={`data:image/png;base64,${item.photoData}`}
              // srcSet={`data:image/png;base64,${item.photoData}`}
              alt={item.title}
              loading='lazy'
              onClick={() => onClickImage(item)}
              onKeyDown={() => onClickImage(item)}
              style={{
                maxWidth: '100%',
                aspectRatio: 'auto',
              }}
            />

            <ImageListItemBar
              sx={{ overflowWrap: 'break-word', maxWidth: 480 }}
              title={item.photoKey}
              subtitle={<span>by: {item?.author}</span>}
              // position='below'
            />
          </ImageListItem>
        </>
      ))}
    </ImageList>
  );
}
