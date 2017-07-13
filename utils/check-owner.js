const checkIfIsOwner = async (ctx, model, target) => {
  let { _doc: { owner } } = await model.findById(ctx.params[target]);

  if (owner.toString() !== ctx.session.user._id.toString()) {

    ctx.toast('请问这是你的东西吗？');
    return true
  }
  return false
};


module.exports = checkIfIsOwner;
