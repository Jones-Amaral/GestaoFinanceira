function favorito(iconElement, id) {
  fetch(`http://localhost:3000/educacao/${id}`)
    .then(res => res.json())
    .then(data => {
      const novoStatus = !data.favoritado;
      data.favoritado = novoStatus;

      return fetch(`http://localhost:3000/educacao/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ favoritado: novoStatus })
      }).then(res => {
        if (!res.ok) throw new Error("Erro ao atualizar favorito");

        // Toggle visual
        iconElement.classList.toggle('favorito', novoStatus);
        iconElement.classList.toggle('far', !novoStatus);
        iconElement.classList.toggle('fas', novoStatus);
      });
    })
    .catch(error => {
      console.error("Erro ao favoritar:", error);
      alert("Não foi possível atualizar o favorito.");
    });
}
