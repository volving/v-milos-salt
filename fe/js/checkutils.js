function checkPhoneNumber(text) {
    return /^(0|86|\+86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(text);
}
