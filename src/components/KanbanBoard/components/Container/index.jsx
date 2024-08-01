import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import Item from '../Item';
import { CSS } from '@dnd-kit/utilities';

const itemWrapperStyle = {
  overflowY: 'auto',
  overflowX: 'hidden',
  height: '400px',
  width: '100%',
  padding: '10px 20px',
};

const containerStyle = {
  background: 'rgb(18 18 18)',
  flex: 1,
  borderRadius: '10px',
  border: '1px solid #30363d',
};

export default function Container(props) {
  const { id, items, label } = props;

  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <SortableContext
      id={id}
      items={items}
      strategy={verticalListSortingStrategy}
    >
      <div ref={setNodeRef} style={containerStyle}>
        <div
          style={{
            padding: '10px 20px 0 20px',
            fontSize: '20px',
            fontWeight: 600,
          }}
        >
          {label}
        </div>
        <div style={itemWrapperStyle}>
          {items.map((item) => (
            <SortableItem key={item?.id} id={item?.id} data={item} />
          ))}
        </div>
      </div>
    </SortableContext>
  );
}

function SortableItem(props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Item id={props.id} data={props?.data} />
    </div>
  );
}
