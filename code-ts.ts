type Tree = {
  value: number;
  left?: Tree | null;
  right?: Tree | null;
};

const tree: Tree = {
  value: 1,
  left: {
    value: 2,
    right: { value: 5 },
  },
  right: { value: 3 },
};

function treePath(root: Tree): string[] {
  let result: any = [];
  let temp: any = [];
  const travel = (r: Tree) => {
    if (r === null) {
      return;
    }
    temp.push(r.value);
    if (r.left == null && r.right == null) {
      result.push(temp);
      temp = [temp[0]];
    }
    if (r.left) {
      travel(r.left);
    }
    if (r.right) {
      travel(r.right);
    }
  };
  travel(root);
  return result.map(item=>item.join("->"));
}
