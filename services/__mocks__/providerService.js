async function profile(type) {
  type = type[Object.keys(type)[0]]
  return {
    name: '$name_' + type,
    email: '$email_' + type + '@dot.com',
    data: {
      id: '$id_' + type,
    },
  }
}

exports.getProfileFromFacebook = profile

exports.getProfileFromGoogle = profile
