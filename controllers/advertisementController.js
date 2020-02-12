const Ad = require('../models/Advertisement');
const { NotFound } = require('../lib/exceptionPool')

module.exports = {
  /**
   * GET /anuncios
   * Devuelve una lista de anuncios
   * Por ejemplo
   *  http://localhost:3000/apiv1/anuncios?limit=2&skip=2&fields=name
   */
  async listAds(req, res, next) {
    const name = req.query.name;
    const sold = req.query.sold;
    const price = req.query.price;
    const tag = req.query.tag;
    const skip = parseInt(req.query.start);
    const limit = parseInt(req.query.limit);
    const fields = req.query.fields;
    const sort = req.query.sort;

    const filter = {};

    if (name) {
      filter.name = new RegExp('^' + name, 'i');
    }

    if (typeof sold !== 'undefined') {
      filter.sold = sold;
    }

    if (price) {
      const greater = /^[0-9]+-$/g.test(price);
      const between = /^[0-9]+-[0-9]+$/g.test(price);
      const less = /^-[0-9]+$/g.test(price);

      const [gte, lte] = price.split('-');

      if (greater) {
        filter.price = { $gte: gte };
      } else if (between) {
        filter.price = { $gte: gte, $lte: lte };
      } else if (less) {
        filter.price = { $lte: lte };
      } else {
        filter.price = price;
      }
    }

    if (tag) {
      filter.tags = { $in: tag };
    }

    const ads = await Ad.list({
      filter: filter,
      skip,
      limit,
      fields,
      sort
    });

    return ads
  },

  /**
   * GET /anuncios:id
   * Obtiene un agente
   */
  async listAdbyId(req, res, next) {
    const ad = await Ad.findOne({_id: req.params.id});
    if (!ad) throw new NotFound()
    return ad
  },

  /**
   * GET /tags
   * Devuelve los tags únicos existentes
   */
  async listTags(req, res, next) {
    const uniqueTags = await Ad.find().distinct('tags');
    return uniqueTags
  },

  /**
   * POST /anuncios
   * Crear un anuncio
   */
  async addAd(req, res, next) {
    const data = req.body;
    const ad = new Ad(data);
    const adSaved = await ad.save();
    return adSaved
  },

  /**
   * PUT /anuncios:id
   * Actualiza un anuncio
   */
  async updateAd(req) {
    const _id = req.params.id;
    const data = req.body;

    const adSaved = await Ad.findOneAndUpdate(
      { _id },
      data,
      {
        new: true
      }
    );

    if (!adSaved) throw new NotFound()
    return adSaved
  },

  /**
   * DELETE /anuncios:id
   * Elimina un anuncio
   */
  async deleteAd(req) {
    const ad = await Ad.findOne({ _id: req.params.id});
    if (!ad) throw new NotFound()
    await ad.remove();
    return { done: true, message: 'Deleted correctly' };
  }
};
